const tg = window.Telegram.WebApp

setTheme()

tg.ready()
tg.expand()

console.log(isMob())

const initData = tg.initData || '';
const initDataUnsafe = tg.initDataUnsafe || {}

function setTheme() {
	document.documentElement.className = tg.colorScheme
}

function isMob() {
	const toMatch = [/Android/i, /iPhone/i, /iPod/i]

	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem)
	})
}
