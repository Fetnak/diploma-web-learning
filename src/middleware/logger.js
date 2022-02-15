export default function log(client, headers, text, isError) {
  if (isError) {
    console.error(`[${new Date().toISOString()}] [ERROR] Client - ${client} | ${headers}\n${text}\n`);
  } else {
    console.log(`[${new Date().toISOString()}] Client - ${client} | ${headers}\n${text}\n`);
  }
}
