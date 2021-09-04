import React, { useEffect, useState } from "react";
import { addNoteFirebase, setNotesFirebase } from '../actions/notesActions'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  display: flex; 
  flex-direction: column;
`

const NoteCardsWrapper = styled.div`
 flex-grow: 1;
 background-color: #D46146;
 padding: 10px;
`

const NoteCardWrapper = styled.div`
  background-color: #F8F8F8;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px 10px;
  white-space: pre-wrap;
`

const NoteCard = ({content}) => {
  return (
    <NoteCardWrapper>
      {content}
    </NoteCardWrapper>
  )
}

const TextAreaWrapper = styled.div`
  height: 100%;
  padding: 10px;
  display: flex;
`;

const NoteInputTextArea = styled.textarea`
  height: 100%;
  flex-grow: 1;
  resize: none;
`

const NoteInputWrapper = styled.div`
  height: 20vh;
  display: flex;
  flex-direction: column;
  background-color: #5F6A91;
`

const EnterButtonWrapper = styled.div`
  width 100%;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
`

const EnterButton = styled.button`
  margin-right: 10px;
  width: 50px;
  height: 20px;
  background-color: #E9D35C;
  color: #5F6A91;
  cursor: pointer;
`

const NoteInput = ({appendNote}) => {
  const [input, setInput] = useState('')

  const handleChange = (event) =>{
    setInput(event.target.value);
  }

  const handleClick = () => {
    const newNote = {deleted: false, content: input}
    appendNote(newNote)
    setInput('')
  }

  const handleKeyDown = (evt) =>{
    if (evt.keyCode == 13 && !evt.shiftKey) {
      evt.preventDefault()
      const newNote = {deleted: false, content: input}
      appendNote(newNote)
      setInput('')
    }
  }

  return (
    <NoteInputWrapper>
      <TextAreaWrapper>
        <NoteInputTextArea value={input} onChange={handleChange} onKeyDown={handleKeyDown}/>
      </TextAreaWrapper>
      <EnterButtonWrapper>
        <EnterButton onClick={handleClick}>Enter</EnterButton>
      </EnterButtonWrapper>
    </NoteInputWrapper>
  )
}

const Notes = () => {
  const [ notes, setNotes ] = useState([])

  useEffect(() => {
    setNotesFirebase(setNotes)
  }, [])

  const appendNote = (note) => {
    const newNotes = [...notes]
    newNotes.push(note)
    setNotes(newNotes)
    addNoteFirebase((newNotes.length - 1).toString(), note)
  }

  console.log('NOTES', notes)

  return(
    <Wrapper>
      <NoteCardsWrapper>
        {notes.map((note, i) => <NoteCard key={i} content={note.content}/>)}
      </NoteCardsWrapper>
      <NoteInput appendNote={appendNote}/>
    </Wrapper>
  )
}

export default Notes