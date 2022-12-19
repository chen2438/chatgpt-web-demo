import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.Model.list()
a = openai.Completion.create(
    model="text-davinci-003",
    prompt="sya this is a test",
    max_tokens=20,
    temperature=0
)
print(a)
print("\n")
print(a.choices)
