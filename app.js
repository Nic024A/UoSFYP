//This function slides the side menu out by 250px and pushes the main content to the right by 250px.
function openSlideMenu(){
    document.getElementById('side-menu').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  }
//This function collapses the side menu completely.
  function closeSlideMenu(){
    document.getElementById('side-menu').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
  }

  const research = document.getElementById('research')
  const development = document.getElementById('development')
  const report = document.getElementById('report')
  const res = document.querySelectorAll('.research-pro svg')
  const dev = document.querySelectorAll('.development-pro svg')
  const rep = document.querySelectorAll('.report-pro svg')
  const FULL_CIRCLE = Math.PI * 2 * (/* r */ 4.5)
  var value = 0

// cheap polyfill for broken change/input events

requestAnimationFrame(function re () {
  if (value !== research.value) {
    value = research.value
    res.forEach(function(el) {
      el.style.setProperty('--percent', value)
      el.style.setProperty('--offset', Math.max(0, FULL_CIRCLE - value * FULL_CIRCLE / 100))
    })
  }

  requestAnimationFrame(re)
})


requestAnimationFrame(function re () {
  if (value !== development.value) {
    value = development.value
    dev.forEach(function(el) {
      el.style.setProperty('--percent', value)
      el.style.setProperty('--offset', Math.max(0, FULL_CIRCLE - value * FULL_CIRCLE / 100))
    })
  }

  requestAnimationFrame(re)
})


requestAnimationFrame(function re () {
  if (value !== report.value) {
    value = report.value
    rep.forEach(function(el) {
      el.style.setProperty('--percent', value)
      el.style.setProperty('--offset', Math.max(0, FULL_CIRCLE - value * FULL_CIRCLE / 100))
    })
  }

  requestAnimationFrame(re)
})
