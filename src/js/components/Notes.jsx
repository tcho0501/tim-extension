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
 background-color: #D3D3D3;
 padding: 10px;
 border-radius: 0 0 5px 5px;
`

const SectionsWrapper = styled.div`
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

const NoteCard = ({content}) => {
  return (
    <NoteCardWrapper>
      {content}
    </NoteCardWrapper>
  )
}

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

const ClosedSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  color: #F8F8F8;
  background-color: #5F6A91;
  line-height: 1.2rem;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`

const SectionTitle = styled.div`
  flex-grow: 1;
`

const SectionDropdown = styled.div`
  width: 20px;
  cursor: pointer;
`

const OpenSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const SectionHeaderWrapper = styled.div`
  background-color: #5F6A91;
  line-height: 1.2rem;
  font-size: 1.2rem;
  border-radius: 5px 5px 0 0;
  display: flex;
  flex-direction: row;
  color: #F8F8F8;
  padding: 10px;
`

const Section = ({section, notes, open, handleSectionClick}) => {
  console.log(section, notes)
  console.log("open?", open)
  return (
  <div>
    { open ? 
    <OpenSectionWrapper>
      <SectionHeaderWrapper>
        <SectionTitle>{section}</SectionTitle>
      </SectionHeaderWrapper>
      <NoteCardsWrapper>
        {notes.map((note, i) => <NoteCard key={i} content={note.content}/>)}
      </NoteCardsWrapper>
    </OpenSectionWrapper> : 
      <ClosedSectionWrapper>
        <SectionTitle>
          {section}
        </SectionTitle>
        <SectionDropdown onClick={() => handleSectionClick(section)}>
          V
        </SectionDropdown>
      </ClosedSectionWrapper> 
    }
  </div>
    
    
  )
}

const Notes = () => {
  const [ notes, setNotes ] = useState({})
  const [ currentOpen, setCurrentOpen ] = useState("General")
  const sections = Object.keys(notes)
  useEffect(() => {
    setNotesFirebase(setNotes)
  }, [])

  const appendNote = (note) => {
    console.log('trying to add note to:', currentOpen)
    console.log(note)
    const newNotes = JSON.parse(JSON.stringify(notes))
    newNotes[currentOpen].push(note)
    setNotes(newNotes)
    addNoteFirebase((newNotes[currentOpen].length - 1).toString(), note, currentOpen)
  }

  const handleSectionClick = (section) => {
    setCurrentOpen(section)
  }

  console.log('NOTES', notes)
  return(
    <Wrapper>
      <SectionsWrapper>
        { sections.map((section, i) => 
          <Section 
            key={i} 
            open={currentOpen === section} 
            section={section} 
            notes={notes[section] || []}
            handleSectionClick={handleSectionClick}
          /> 
        )}
      </SectionsWrapper>
      <NoteInput appendNote={appendNote}/>
    </Wrapper>
  )
}

export default Notes