import os
import openai
openai.api_key = "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"
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
