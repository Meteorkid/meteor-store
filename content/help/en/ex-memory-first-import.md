## Sign in and configure your own models

Ex-Memory builds a personal memory mirror from chat records, uses expressions in those records for AI-simulated conversations, and lets you correct persona details and memories. Generated replies can be wrong and do not represent the person's actual words or thoughts.

For your first use, follow this order: **Sign in → Account model settings → Import an example or records → Chat**.

1. Select **Try online** on the [product page](/products/ex-memory) and sign in with Meteor Store.
2. Open **Model settings** in the app. Configure a **chat model** and an **embedding model** for this account: choose each provider, enter the model name, and supply your own API key. The chat model generates profiles and replies; the embedding model converts text into vectors for retrieval. Complete both configurations.
3. Save the settings before importing. Built-in chat providers include DeepSeek, SiliconFlow, OpenAI, Anthropic, and Google Gemini; built-in embedding providers include SiliconFlow, OpenAI, and Google Gemini. Follow the settings screen and your provider account's model permissions. Regional availability depends on the provider's policies.

Chat supports OpenAI-compatible APIs, Anthropic Messages, and Gemini generateContent. Embedding supports OpenAI-compatible APIs and Gemini embedContent / batchEmbedContents. Anthropic does not provide embeddings. These integrations generate text and build text-retrieval vectors.

- Anthropic: Use an API key scoped to a specific workspace. Follow the [official instructions](https://platform.claude.com/docs/en/manage-claude/authentication#select-a-workspace) to create one.
- Gemini native embeddings: Ex-Memory requests 1024-dimensional output and normalizes the vectors. Choose a model that supports 1024-dimensional output; see the [official dimensionality guide](https://ai.google.dev/gemini-api/docs/embeddings#controlling-embedding-size).

For a custom service, select a **custom OpenAI-compatible service**, **custom Anthropic service**, or **custom Gemini service** to match the provider's API format. Enter its public HTTPS API base URL, model name, and your own key.

A custom service must provide the relevant chat or embedding endpoint. Localhost, private-network addresses, and endpoints that redirect to another address are not supported. Necessary text is sent to your chosen providers, including custom services. Each API key is sent only to its corresponding address. Check the URL and the provider's data-processing policy before saving.

Online access requires no purchase or free claim; plan purchases are not available. **Your selected providers bill model usage to your accounts. This site does not supply model credits.** Importing the example also calls your configured models, so check provider balances, permissions, and pricing first.

Settings are saved per signed-in account. API keys are encrypted on the server, and settings show only the last four characters. You can update or delete keys. A different Meteor Store account needs its own settings. Existing indexes lock the embedding provider, API format, and model to keep retrieval consistent; you can still replace a key for the same provider and model.

## Import and create a mirror

Once your models are configured, download the **fictional chat example** inside the app for your first import. It contains no real user's chat records.

1. Choose a chat file. Start with the fictional example, or use your own or authorized records after removing unrelated sensitive content. Follow the import screen's supported formats and size limits.
2. Enter a mirror name and the **target speaker's name as it appears in the chat records**. The mirror name helps you distinguish people; the target speaker identifies whose expressions to use. Do not enter a name that is absent from the records.
3. Read and confirm the online storage and model-processing notice, then select **Import and create**. The upload does not start before confirmation.
4. Wait for import and persona generation to finish before chatting. A failed import and a successful creation are different states; follow the status shown in the app.

To obtain a chat file from WeChat, consult the export guide inside the app. The local helper exports on your computer; uploading the file sends its contents to the online service.

## Try your first conversation

Ask a question you can check against the records, such as “Which weekend plans appear in these records?” Compare the reply with the original file for factual accuracy and appropriate expression.

Use the mirror's correction control to fix persona details or memories, then continue asking questions. AI replies and user corrections are separate from original chats and should not be treated as evidence of what the person said.

## Continue after a failed import

- **No messages parsed or target speaker not found:** Check the file format, contents, and speaker name, then import again.
- **Models are not configured or a key is unavailable:** Open **Model settings**, check both configurations for this account, and verify the keys, model permissions, and balances in your provider accounts. Then retry as prompted.
- **Persona generation failed:** Check the chat-model configuration as prompted, or try again later. If the app retains an unfinished mirror, continue importing into that mirror instead of repeatedly creating new ones.
- **The experience does not respond:** Select **Reload**. If it still fails, return to the product page and [report the issue](/feedback?type=question). Include steps and error messages, but no complete private chats or API keys.

## Where data is processed

The online experience stores uploaded chat records, persona details and memories, simulated conversations, and corrections on the website server, associated with your Meteor Store user ID. Necessary content is sent to the embedding and chat-model providers you choose in **Model settings**, including custom services you enter, to build retrieval indexes and generate profiles and replies.

Local export and online processing are separate stages. Exporting with the local helper does not mean later uploads, retrieval, and conversations run entirely on your computer. Providers and processing locations depend on the current model configuration. Before uploading, read the notice in the app and the [privacy policy](/privacy#ex-memory).

You can delete mirrors and saved API keys separately in the app. Deleting a key does not delete mirrors. Use the contact details in the privacy policy for other retained-data or authorization-withdrawal requests. Deleting a mirror or key does not recall requests already sent to model providers.
