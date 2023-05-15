/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// *** HORIZONTAL SCROLLER by Adrián Gubrica, v1.7 *** //
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/////////////// Variables /////////////////

// ---> selector [string] - Selector for the div
// ---> speed [int or float] - Speed of the horizontal scroll
// ---> ease [int or float] - Ease amount on the horizontal scroll
// ---> cursor [bool] - Changes the cursor to "grab", when hovering the horizontal scroll
// ---> initialPosition [int or float] - Sets the scroll to specified position, when initialized
// ---> controls [bool] - Want to use arrows or not
// ---> breakpoint[int or float] - Set breakpoint, where the Horizontal scroller should stop working

export default class HorizontalScroller {
  constructor(_options) {
    //
    // GLOBAL
    //

    this.selector = document.querySelector(_options.selector)
    this.speed = _options.speed
    this.ease = _options.ease
    this.cursor = _options.cursor
    this.initialPosition = _options.initialPosition
    this.controls = _options.controls
    this.breakpoint = _options.breakpoint

    // ---> Arrows
    if (this.controls) {
      this.arrows = {
        left: document.querySelector(_options.arrows.left),
        right: document.querySelector(_options.arrows.right),
        step: _options.arrows.step,
      }
    }

    // Flags
    this.arrowFlag = true
    if (this.breakpoint) {
      this.breakpointFlag = window.innerWidth > this.breakpoint ? true : false
    } else {
      this.breakpointFlag = true
    }

    // Init
    this.firstRunFlag = true

    if (this.selector) {
      this.onResize()
      this.setStyles(this.selector)
      this.scroll(this.selector)
      this.animationFrame()
      this.handleLinks()
      if (this.controls) {
        this.setArrows()
      }
    } else {
      // console.warn('Horizontal Scroll: Please provide valid selector.')
    }

    //

    this.isDown = false
    this.startX
    this.scrollLeft
    this.x
    this.dist = 0

    // this.mathvalue = 3.3908
  }

  handleLinks() {
    this.links = this.selector.querySelectorAll('a')

    this.links.forEach((_link) => {
      _link.addEventListener('click', (_e) => {
        _e.preventDefault()

        if (!this.dist) {
          window.location.href = _e.target.href
        }
      })
    })
  }

  setStyles(_selector) {
    _selector.style.overflowX = 'hidden'
    if (this.cursor) {
      _selector.style.cursor = 'grab'
    }
  }

  scroll(_selector) {
    if (_selector) {
      this.slider = _selector

      this.end = () => {
        if (this.breakpointFlag) {
          this.isDown = false
          this.slider.classList.remove('active')
        }
      }

      this.start = (e) => {
        if (this.breakpointFlag) {
          this.dist = 0

          this.isDown = true
          this.slider.classList.add('active')
          this.startX = e.pageX || e.touches[0].pageX - this.slider.offsetLeft
          this.scrollLeft = this.slider.scrollLeft
        }
      }

      this.move = (e) => {
        if (this.breakpointFlag) {
          if (!this.isDown) return

          e.preventDefault()
          this.x = e.pageX || e.touches[0].pageX - this.slider.offsetLeft
          this.dist = (this.x - this.startX) / this.speed
          this.bouncedist = (this.x - this.startX) / (this.speed * 1.5)

          // this.slider.scrollLeft = this.scrollLeft - this.dist
        }
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

  //
  // ARROWS
  //

  setArrows() {
    this.arrows.left.addEventListener('click', () => {
      this.moveWithArrows('left')
    })

    this.arrows.right.addEventListener('click', () => {
      this.moveWithArrows('right')
    })
  }

  moveWithArrows(_direction) {
    if (_direction == 'left') {
      this.dist = this.arrows.step
      this.bouncedist = this.arrows.step
    } else if (_direction == 'right') {
      this.dist = -this.arrows.step
      this.bouncedist = -this.arrows.step
    }
  }

  onResize() {
    window.onresize = () => {
      this.breakpointFlag = window.innerWidth > this.breakpoint ? true : false
    }
  }

  //
  // ANIMATE
  //

  animationFrame() {
    this.dist *= this.ease
    this.bouncedist *= this.ease

    // For the first frame (bug prevention)
    if (this.firstRunFlag) {
      this.slider.scrollLeft = this.initialPosition
      this.firstRunFlag = false
    } else {
      // Next frames
      this.slider.scrollLeft = this.slider.scrollLeft - this.dist

      // ---> Left
      if (this.slider.scrollLeft < 10) {
        // [] Bounce
        this.selector.style.transform = `translateX(${this.bouncedist}px)`

        // [] Make Arrow Inactive
        if (this.arrowFlag) {
          if (this.controls) {
            this.arrows.left.style.pointerEvents = 'none'
            this.arrows.left.style.opacity = '0.25'
          }
          this.arrowFlag = false
        }

        // ---> Right
      } else if (this.slider.scrollLeft > this.slider.scrollWidth - this.slider.offsetWidth - 10) {
        // [] Bounce
        this.selector.style.transform = `translateX(${this.bouncedist}px)`

        // [] Make Arrow Inactive
        if (this.arrowFlag) {
          if (this.controls) {
            this.arrows.right.style.pointerEvents = 'none'
            this.arrows.right.style.opacity = '0.25'
          }
          this.arrowFlag = false
        }

        // ---> Center
      } else {
        if (!this.arrowFlag) {
          if (this.controls) {
            this.arrows.right.style.pointerEvents = 'all'
            this.arrows.left.style.pointerEvents = 'all'

            this.arrows.right.style.opacity = '1'
            this.arrows.left.style.opacity = '1'
          }
        }
        this.arrowFlag = true

        this.selector.style.transform = `translateX(${0}px)`
      }
    }

    window.requestAnimationFrame(this.animationFrame.bind(this))
  }
}
