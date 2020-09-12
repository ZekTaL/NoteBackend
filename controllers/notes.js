const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET ALL NOTES
notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

// GET SINGLE NOTE BY ID
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

// POST A NOTE
notesRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    })

    note
      .save()
      .then(savedNote => savedNote.toJSON())
      .then(savedAndFormattedNote => response.json(savedAndFormattedNote))
      .catch(error => next(error))
})

// DELETE A NOTE BY ID
notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

// UPDATE A NOTE BY ID
notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
      content: body.content,
      important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})

module.exports = notesRouter