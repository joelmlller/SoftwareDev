const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getPointAdvice(driverActionDescription, sponsorPointRatio) {
  console.log("about to call api");
  const model = 'gpt-4-turbo-preview'; 
  const OPENAI_POINT_CONSULTANT_ID = process.env.OPENAI_POINT_CONSULTANT_ID; // Ensure this is set in .env
    if(sponsorPointRatio == NULL) {
        // Setting defualt point to dollar ratio
        sponsorPointRatio = .01
    }
  try {
    // Create a Thread
    const myThread = await openai.beta.threads.create();
    console.log("This is the thread object: ", myThread, "\n");
    
    // Add a Message to the Thread
    const myThreadMessage = await openai.beta.threads.messages.create(myThread.id, {
      role: 'user',
      content: `Driver Action Description: [${driverActionDescription}]\nSponsor Point to Dollar Ratio: [${sponsorPointRatio}]`,
    });
    console.log("This is the message object: ", myThreadMessage, "\n");

    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(myThread.id, {
      assistant_id: OPENAI_POINT_CONSULTANT_ID,
    });
    console.log("This is the run object: ", myRun, "\n");

    // Retrieve the Run to check on its status
    let keepRetrievingRun;
    do {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(myThread.id, myRun.id);
      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === 'completed') {
        // Retrieve the Messages added by the Assistant to the Thread
        const allMessages = await openai.beta.threads.messages.list(myThread.id);
        console.log("------------------------------------------------------------ \n");

        // Assuming the last message is the assistant's advice
        const assistantMessage = allMessages.data[allMessages.data.length - 1];
        console.log("Assistant: ", assistantMessage.content[0].text.value);

        return assistantMessage.content[0].text.value;
      } else if (keepRetrievingRun.status === 'failed' || keepRetrievingRun.status === 'expired') {
        console.log(`Run failed or expired: ${keepRetrievingRun.status}`);
        return 'Unable to retrieve point advice at this time.';
      }

      // Add a delay if status is queued or in progress to prevent rate limiting
      if (keepRetrievingRun.status === 'queued' || keepRetrievingRun.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay
      }
    } while (keepRetrievingRun.status === 'queued' || keepRetrievingRun.status === 'in_progress');
  } catch (error) {
    console.error('Error getting point advice:', error);
    return 'Error processing your request for point advice.';
  }
}