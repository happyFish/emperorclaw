"""SSH into VPS to check and fix deploy."""
import subprocess, sys

HOST = "VPS_IP_REDACTED"
USER = "ROOT"
PASS = "VPS_PASSWORD_REDACTED"

def ssh(cmd):
    proc = subprocess.Popen(
        ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null",
         f"{USER}@{HOST}", cmd],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    out, err = proc.communicate(input=f"{PASS}\n".encode(), timeout=30)
    return out.decode(errors="replace") + err.decode(errors="replace")

print("=== GIT LOG ===")
print(ssh("cd /var/www/emperorclaw && git log --oneline -5"))
print("=== PM2 STATUS ===")
print(ssh("pm2 status emperorclaw --no-color 2>&1 || echo 'pm2 not found'"))
print("=== INCIDENTS PAGE ===")
print(ssh("ls /var/www/emperorclaw/src/app/'(app)'/incidents/ 2>&1 || echo 'NOT_FOUND'"))
