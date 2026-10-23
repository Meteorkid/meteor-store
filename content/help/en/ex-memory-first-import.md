## Start with the example

Ex-Memory builds a personal memory mirror from chat records, uses expressions in those records for AI-simulated conversations, and lets you correct persona details and memories. Generated replies can be wrong and do not represent the person's actual words or thoughts.

Select **Try online** on the [product page](/products/ex-memory), then sign in with Meteor Store. The online trial requires no purchase or free claim. Plan purchases are not available yet. Available trial credits are shown in the app.

For your first import, download the **fictional chat example** inside the app. It contains no real user's chat records.

## Import and create a mirror

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
- **Persona generation failed:** Check the model configuration as prompted, or try again later. If the app retains an unfinished mirror, continue importing into that mirror instead of repeatedly creating new ones.
- **The experience does not respond:** Select **Reload**. If it still fails, return to the product page and [report the issue](/feedback?type=question). Include steps and error messages, but no complete private chats or API keys.

## Where data is processed

The online trial stores uploaded chat records, persona details and memories, simulated conversations, and corrections on the website server, associated with your Meteor Store user ID. Necessary content is sent to the configured embedding and chat-model services to build retrieval indexes and generate profiles and replies.

Local export and online processing are separate stages. Exporting with the local helper does not mean later uploads, retrieval, and conversations run entirely on your computer. Providers and processing locations depend on the current model configuration. Before uploading, read the notice in the app and the [privacy policy](/privacy#ex-memory).

You can delete mirrors in the app. Use the contact details in the privacy policy for other retained-data or authorization-withdrawal requests. Deleting a mirror does not recall requests already sent to model providers.
