///////////////////////////////////////////////////
///////////////////////////////////////////////////
// *** HORIZONTAL SCROLLER by Adrián Gubrica *** //
///////////////////////////////////////////////////
/////////////////////// v1.0 //////////////////////

//////////////////// Poznámky /////////////////////

export default class HorizontalScroller {
  constructor(_options) {
    //
    // GLOBAL
    //

    this.selector = document.querySelector(_options.selector)
    this.speed = _options.speed
    this.ease = _options.ease
    this.cursor = _options.cursor

    // Init

    if (this.selector) {
      this.setStyles(this.selector)
      this.scroll(this.selector)
      this.animationFrame()
    } else {
      console.warn('Horizontal Scroll: Please provide valid selector.')
    }

    //

    this.isDown = false
    this.startX
    this.scrollLeft
    this.x
    this.dist
  }

  setStyles(_selector) {
    _selector.style.overflow = 'hidden'
    if (this.cursor) {
      _selector.style.cursor = 'grab'
    }
  }

  scroll(_selector) {
    if (_selector) {
      this.slider = _selector

      this.end = () => {
        this.isDown = false
        this.slider.classList.remove('active')
      }

      this.start = (e) => {
        this.isDown = true
        this.slider.classList.add('active')
        this.startX = e.pageX || e.touches[0].pageX - this.slider.offsetLeft
        this.scrollLeft = this.slider.scrollLeft
      }

      this.move = (e) => {
        if (!this.isDown) return

        e.preventDefault()
        this.x = e.pageX || e.touches[0].pageX - this.slider.offsetLeft
        this.dist = (this.x - this.startX) / this.speed
        // this.slider.scrollLeft = this.scrollLeft - this.dist
      }
      ;(() => {
        this.slider.addEventListener('mousedown', this.start)
        this.slider.addEventListener('touchstart', this.start)

        this.slider.addEventListener('mousemove', this.move)
        this.slider.addEventListener('touchmove', this.move)

        this.slider.addEventListener('mouseleave', this.end)
        this.slider.addEventListener('mouseup', this.end)
        this.slider.addEventListener('touchend', this.end)
      })()
    }
  }

  animationFrame() {
    this.dist *= this.ease

    this.slider.scrollLeft = this.slider.scrollLeft - this.dist
    window.requestAnimationFrame(this.animationFrame.bind(this))
  }

  lerp(min, max, fraction) {
    return (max - min) * fraction + min
  }
}
