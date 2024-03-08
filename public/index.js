let handleSubmittedForm = document.querySelector('#submitForm')
handleSubmittedForm.addEventListener('submit', async ($event) => {
    $event.preventDefault()
    let form = new FormData()
    let pdfFiles = document.querySelector('#pdf').files
    form.append('pdf', pdfFiles.item(key))
    let response = await fetch("/image-extract", {
        method: "POST",
        body: form
    })

    response = await response.json()
    console.log(response)
})