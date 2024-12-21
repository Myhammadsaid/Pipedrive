function collectFormData() {
	const formData = {
		clientDetails: {
			firstName: document.getElementById('first-name').value,
			lastName: document.getElementById('last-name').value,
			phone: document.getElementById('phone').value,
			email: document.getElementById('email').value,
		},
		jobDetails: {
			jobType: document.getElementById('job-type').value,
			jobSource: document.getElementById('job-source').value,
			jobDescription: document.getElementById('job-desc').value,
		},
		serviceLocation: {
			address: document.getElementById('address').value,
			city: document.getElementById('city').value,
			state: document.getElementById('state').value,
			zipCode: document.getElementById('zip').value,
			area: document.getElementById('area').value,
		},
		scheduled: {
			startDate: document.getElementById('start-date').value,
			startTime: document.getElementById('start-time').value,
			endTime: document.getElementById('end-time').value,
			testSelect: document.getElementById('test-select').value,
		},
	}
	return formData
}
function clearForm() {
	const inputs = document.querySelectorAll('input, select, textarea')
	inputs.forEach(input => {
		if (input.type === 'checkbox' || input.type === 'radio') {
			input.checked = false
		} else {
			input.value = ''
		}
	})
}
async function sendToPipedrive(data) {
	const apiToken = '027bc21098585d289bf4231074b25faa193c9173' // замените на ваш API-токен
	const url = `https://api.pipedrive.com/v1/deals?api_token=${apiToken}`

	// Создаём объект данных, подходящий для Pipedrive
	const body = {
		title: `${data.clientDetails.firstName} ${data.clientDetails.lastName} - Job`,
		value: 0,
		person_id: null,
		org_id: null,
		stage_id: null,
		custom_fields: {
			phone: data.clientDetails.phone,
			email: data.clientDetails.email,
			address: `${data.serviceLocation.address}, ${data.serviceLocation.city}, ${data.serviceLocation.state}, ${data.serviceLocation.zipCode}`,
			job_type: data.jobDetails.jobType,
			start_date: data.scheduled.startDate,
		},
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}

		const result = await response.json()
		console.log('Deal successfully created in Pipedrive:', result)
		alert('Deal created successfully!')

		// Очистка формы
		clearForm()
	} catch (error) {
		console.error('Error creating deal:', error)
		alert('Failed to create deal. Check the console for more details.')
	}
}

document.getElementById('submit-button').addEventListener('click', async e => {
	e.preventDefault() // предотвращаем перезагрузку страницы
	const formData = collectFormData() // собираем данные формы
	await sendToPipedrive(formData) // отправляем их в Pipedrive
})
