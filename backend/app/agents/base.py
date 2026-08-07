import json
import re
from openai import AsyncOpenAI


class BaseAgent:
    """Shared LLM setup + resilient JSON calling for all Day One agents.

    Every agent was independently doing `json.loads(response.content)` with
    no error handling, no markdown-fence stripping, and no retry — meaning a
    single malformed response (very common with free-tier models, or any
    model that wraps output in ```json fences) would crash the whole
    pipeline mid-demo. This base class centralizes a safer call pattern:
    strip fences, validate required keys, retry once, then fall back to a
    canned-but-usable response instead of raising.

    Uses the `openai` SDK directly against OpenRouter's OpenAI-compatible
    endpoint (previously used `langchain` for this, but `langchain==0.1.0`'s
    dependency chain — langsmith, numpy<2, etc. — has no wheels for newer
    Python versions, which broke installs. This is the same functionality
    with far fewer moving parts.)
    """

    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini", temperature: float = 0.7):
        self.model_name = model_name
        self.temperature = temperature
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.aimlapi.com/v1",
            default_headers={
                "HTTP-Referer": "https://github.com/yourusername/day-one",
                "X-Title": "Day One - AI Startup Validator"
            }
        )

    async def _complete(self, prompt: str) -> str:
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=self.temperature,
        )
        return response.choices[0].message.content

    @staticmethod
    def _extract_json(text: str) -> dict:
        """Pull a JSON object out of an LLM response, tolerating ```json fences
        or stray preamble/trailing text around the object."""
        match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
        if match:
            json_str = match.group(1)
        else:
            # Fall back to grabbing the first { ... last } if no fence present
            start = text.find("{")
            end = text.rfind("}")
            json_str = text[start:end + 1] if start != -1 and end != -1 else text
        return json.loads(json_str)

    @staticmethod
    def _validate(data: dict, required_keys: set):
        """required_keys may use dot-paths (e.g. 'challenge.reason') to check
        nested fields, since several agents return a nested challenge object."""
        for key in required_keys:
            node = data
            for part in key.split("."):
                if not isinstance(node, dict) or part not in node:
                    raise ValueError(f"Missing required key path: {key}")
                node = node[part]

    async def _call_json(self, prompt: str, required_keys: set, fallback: dict) -> dict:
        """Call the LLM expecting a JSON object back. Retries once on any
        failure (malformed JSON, missing keys, API/timeout error), then
        returns `fallback` so one bad response never crashes a live run."""
        last_error = None
        for attempt in range(2):
            try:
                content = await self._complete(prompt)
                data = self._extract_json(content)
                self._validate(data, required_keys)
                return data
            except Exception as e:
                last_error = e
                print(f"[{self.__class__.__name__}] LLM call failed (attempt {attempt + 1}/2): {e}")
        print(f"[{self.__class__.__name__}] Falling back after repeated failures: {last_error}")
        return fallback

    async def _call_text(self, prompt: str, fallback: str) -> str:
        """Call the LLM expecting plain text back (e.g. the elevator pitch).
        Same retry-then-fallback behavior as _call_json, without JSON parsing."""
        for attempt in range(2):
            try:
                content = await self._complete(prompt)
                text = (content or "").strip()
                if text:
                    return text
                raise ValueError("Empty response")
            except Exception as e:
                print(f"[{self.__class__.__name__}] LLM call failed (attempt {attempt + 1}/2): {e}")
        return fallback
