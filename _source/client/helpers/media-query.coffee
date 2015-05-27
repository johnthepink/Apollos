
# remove for junction.debounce once stable
class _debounce

  constructor: (@data) ->
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

    @.callback = @data
    @.ticking = false

  update: =>
    @.callback and @.callback()
    @.ticking = false

  requestTick: =>
    unless @.ticking
      requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)))
      @.ticking = true

  handleEvent: =>
    @.requestTick()



Meteor.startup ->

  # set up var and dependency for tracking
  currentSize = ""
  currentSizeDep = new Tracker.Dependency
  stylesApplied = []

  # comparator function
  test = (size) ->
    currentSizeDep.depend()
    return currentSize is size


  # lock Dom events in nonreactive so we never rebind events
  Tracker.nonreactive ->

    # create marker element
    marker = document.createElement("DIV")
    marker.id = "media-query"

    # hide it
    marker.style.display = "none !important"

    # add it to the Dom
    document.body.appendChild marker

    # update size on resize event
    getSize = ->
      currentSize = $("#media-query").css("content").replace /'/g, ""
      currentSizeDep.changed()
      return

    # debounce (can move this to junction once stable)
    deouncedGetSize = new _debounce getSize
    window.addEventListener "resize", deouncedGetSize, false

    # fire once for on load checking
    getSize()




  # register global helper for media queries
  Template.registerHelper "MediaQuery", (size) ->

    return test(size)