const executeRequests = () => {
    Promise.all([
        fetch('https://hot.gumyo.net/api/refresh/qs', { method: 'POST' }),
        fetch('https://hot.gumyo.net/api/refresh/pm', { method: 'POST' }),
    ])
        .then((responses) => {
            responses.forEach((response) => {
                console.log(`${response.url}: ${response.status}`)
            })
        })
        .catch((error) => {
            console.error('Error executing requests:', error)
        })
}
executeRequests()
