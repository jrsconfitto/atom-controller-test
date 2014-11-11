# fs = require 'fs'
#remote = require 'remote'
fs = require 'fs-plus'

Notify = require 'fs.notify'
rx = require 'rx'

module.exports =
class LiveReload
  constructor: (dirs...) ->
    @dirs = dirs

  traverseTreeObservable: (dir) ->
    rx.Observable.create (subj) ->
      fs.traverseTree(dir, subj.onNext, ( ->), subj.onCompleted)
      return rx.Disposable.empty

  watchObservable: (files) ->
    rx.Observable.Create (subj) ->
      notify = new Notify(files)
      return rx.Node.fromEvent(notify, 'change').subscribe(subj)

  watchAll: ->
    rx.Observable.fromArray(@dirs)
      .selectMany (x) => @traverseTreeObservable(x)
      .selectMany (x) => @watchObservable(x)

  attach: ->
    @watchAll().throttle(250).subscribe ->
      #remote.getCurrentWindow().reload()
      getCurrentWindow().reload()
