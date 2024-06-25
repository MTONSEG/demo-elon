const tg = window.tg

setThemeClass()

tg.ready()

const initData = tg.initData
const initDataUnsafe = tg.initDataUnsafe

function setThemeClass() {
	document.documentElement.className = tg.colorScheme
}

function sendMessage(msg_id, with_webview) {
	if (!initDataUnsafe.query_id) {
		alert('WebViewQueryId not defined')
		return
	}

	document
		.querySelectorAll('button')
		.forEach((button) => (button.disabled = true))

	const btnStatus = document.getElementById('btn_status')
	btnStatus.textContent = 'Sending...'
	btnStatus.classList.remove('ok', 'err')
	btnStatus.style.display = 'block'

	axios
		.post('/demo/sendMessage', {
			_auth: initData,
			msg_id: msg_id || '',
			with_webview: !initDataUnsafe.receiver && with_webview ? 1 : 0
		})
		.then(function (response) {
			document
				.querySelectorAll('button')
				.forEach((button) => (button.disabled = false))

			if (response.data.response) {
				if (response.data.response.ok) {
					btnStatus.innerHTML = 'Message sent successfully!'
					btnStatus.classList.add('ok')
				} else {
					btnStatus.textContent = response.data.response.description
					btnStatus.classList.add('err')
					alert(response.data.response.description)
				}
			} else {
				btnStatus.textContent = 'Unknown error'
				btnStatus.classList.add('err')
				alert('Unknown error')
			}
		})
		.catch(function (error) {
			document
				.querySelectorAll('button')
				.forEach((button) => (button.disabled = false))
			btnStatus.textContent = 'Server error'
			btnStatus.classList.add('err')
			alert('Server error')
		})
}

function webviewExpand() {
	tg.expand()
}

function webviewClose() {
	tg.close()
}

function requestLocation(el) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			el.nextElementSibling.innerHTML =
				'(' + position.coords.latitude + ', ' + position.coords.longitude + ')'
			el.nextElementSibling.setAttribute('class', 'ok')
		})
	} else {
		el.nextElementSibling.innerHTML =
			'Geolocation is not supported in this browser.'
		el.nextElementSibling.setAttribute('class', 'err')
	}
	return false
}

function requestVideo(el) {
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: true
			})
			.then(function (stream) {
				el.nextElementSibling.innerHTML = '(Access granted)'
				el.nextElementSibling.setAttribute('class', 'ok')
			})
	} else {
		el.nextElementSibling.innerHTML =
			'Media devices is not supported in this browser.'
		el.nextElementSibling.setAttribute('class', 'err')
	}
	return false
}

function requestAudio(el) {
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: false
			})
			.then(function (stream) {
				el.nextElementSibling.innerHTML = '(Access granted)'
				el.nextElementSibling.setAttribute('class', 'ok')
			})
	} else {
		el.nextElementSibling.innerHTML =
			'Media devices is not supported in this browser.'
		el.nextElementSibling.setAttribute('class', 'err')
	}
	return false
}

tg.onEvent('themeChanged', function () {
	document.getElementById('theme_data').innerHTML = JSON.stringify(
		tg.themeParams,
		null,
		2
	)
})

document.getElementById('main_btn').style.display = initDataUnsafe.query_id
	? 'block'
	: 'none'
document.getElementById('with_webview_btn').style.display =
	initDataUnsafe.query_id && !initDataUnsafe.receiver ? 'block' : 'none'
// document.getElementById('data_btn').style.display = !initDataUnsafe.query_id || !initDataUnsafe.receiver ? 'block' : 'none';
document.getElementById('webview_data').innerHTML = JSON.stringify(
	initDataUnsafe,
	null,
	2
)
document.getElementById('theme_data').innerHTML = JSON.stringify(
	tg.themeParams,
	null,
	2
)
document
	.getElementById('regular_link')
	.setAttribute(
		'href',
		document.getElementById('regular_link').getAttribute('href') + location.hash
	)
// document.getElementById('text_field').focus()

if (initDataUnsafe.query_id && initData) {
	document.getElementById('webview_data_status').style.display = 'block'
	axios
		.post('/demo/checkData', {
			_auth: initData
		})
		.then(function (response) {
			if (response.data.ok) {
				document.getElementById('webview_data_status').innerHTML =
					'Hash is correct'
				document
					.getElementById('webview_data_status')
					.setAttribute('class', 'ok')
			} else {
				document.getElementById('webview_data_status').innerHTML =
					response.data.error
				document
					.getElementById('webview_data_status')
					.setAttribute('class', 'err')
			}
		})
		.catch(function (error) {
			document.getElementById('webview_data_status').innerHTML = 'Server error'
			document
				.getElementById('webview_data_status')
				.setAttribute('class', 'err')
		})
}

document.body.style.visibility = 'visible'
tg.MainButton.setText('CLOSE WEBVIEW_MY')
	.show()
	.onClick(function () {
		webviewClose()
	})

function toggleMainButton(el) {
	var mainButton = tg.MainButton

	if (mainButton.isVisible) {
		mainButton.hide()
		el.innerHTML = 'Show Main Button'
	} else {
		mainButton.show()
		el.innerHTML = 'Hide Main Button'
	}
}

function round(val, d) {
	var k = Math.pow(10, d || 0)
	return Math.round(val * k) / k
}

function setViewportData() {
	document
		.querySelector('.viewport_border')
		.setAttribute(
			'text',
			window.innerWidth + ' x ' + round(tg.viewportHeight, 2)
		)
	document
		.querySelector('.viewport_stable_border')
		.setAttribute(
			'text',
			window.innerWidth +
				' x ' +
				round(tg.viewportStableHeight, 2) +
				' | is_expanded: ' +
				(tg.isExpanded ? 'true' : 'false')
		)
}

tg.onEvent('viewportChanged', setViewportData)
setViewportData()

tg.onEvent('themeChanged', setThemeClass)
