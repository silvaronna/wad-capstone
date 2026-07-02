const net = require('net');

const dbUrl = process.env.DATABASE_URL || "mysql://root:guyonwaton@localhost:3306/wadcapstone";
let host = 'localhost';
let port = 3306;

try {
  const parsed = new URL(dbUrl);
  host = parsed.hostname || 'localhost';
  port = parseInt(parsed.port, 10) || 3306;
} catch (e) {
  console.warn("Could not parse DATABASE_URL, using defaults.");
}

console.log(`Checking connection to database at ${host}:${port}...`);

function check() {
  const client = new net.Socket();
  client.connect(port, host, () => {
    console.log("Database connection successful!");
    client.end();
    process.exit(0);
  });
  client.on('error', (err) => {
    console.log("Waiting for database connection...");
    client.destroy();
    setTimeout(check, 1000);
  });
}
check();
