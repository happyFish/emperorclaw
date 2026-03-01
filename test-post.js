(async () => {
    const res = await fetch("http://localhost:3000/api/mcp/agents", {
        method: "POST",
        headers: {
            "Authorization": "Bearer ***REMOVED_TOKEN***",
            "Content-Type": "application/json",
            "Idempotency-Key": "test-idem-key-1"
        },
        body: JSON.stringify({
            name: "Test Agent",
            role: "operator",
            skillsJson: [],
            concurrencyLimit: 1
        })
    });
    console.log(res.status);
    console.log(await res.text());
})();
