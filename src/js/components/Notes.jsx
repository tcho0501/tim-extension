import React, { useEffect, useState } from "react";
import { addNoteFirebase, setNotesFirebase, setNotesSectionsFirebase, addNotesSectionFirebase } from '../actions/notesActions'
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
 text-align: center;
`

const SectionsWrapper = styled.div`
  flex-grow: 1;
  background-color: #D46146;
  padding: 10px;
  overflow-y: scroll;
  flex-basis: 0;
  ::-webkit-scrollbar {
    width: 5px;
    background: #D46146;
  }
  ::-webkit-scrollbar-thumb {
    background: #E9D35C;
  }
`

const NoteCardWrapper = styled.div`
  background-color: #F8F8F8;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px 10px;
  white-space: pre-wrap;
  text-align: left;
  position: relative;
`

const TextAreaWrapper = styled.div`
  height: 100%;
  padding: 10px;
  display: flex;
`;

const NoteInputTextArea = styled.textarea`
  flex-grow: 1;
  resize: none;
`

const NoteInputWrapper = styled.div`
  height: 20vh;
  display: flex;
  flex-direction: column;
  background-color: #5F6A91;
`

const EnterButton = styled.button`
  margin-right: 10px;
  padding: 2px 5px;
  font-size: 12px;
  line-height: 12px;
  background-color: #E9D35C;
  color: #5F6A91;
  cursor: pointer;
  border: none;
  white-space: pre-wrap;
  :hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }
`

const DeleteIcon = styled.img`
  ${props => props.showIcon ? "" : "display: none;"}
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
` 

const NoteCard = ({content, id, deleteNote}) => {
  const [showIcon, setShowIcon] = useState(false)
  return (
    <NoteCardWrapper 
      onMouseEnter={e => {setShowIcon(true);}}
      onMouseLeave={e => {setShowIcon(false);}}
    >
      <div style={{display: "inline"}}>{content}</div>
      <DeleteIcon 
        onClick={() => {deleteNote(id)}}
        showIcon={showIcon} 
        src={chrome.runtime.getURL(`icons/delete.png`)} 
        alt="delete"
      />
    </NoteCardWrapper>
  )
}

const NoteInput = ({appendNote}) => {
  const [input, setInput] = useState('')

  const handleChange = (event) =>{
    setInput(event.target.value);
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

const Section = ({section, sectionNotes, open, handleSectionClick, setNotes, notes}) => {

  const deleteNote = (id) => {
    console.log('deleting', section, id)
    const newNotes = JSON.parse(JSON.stringify(notes))
    const newSection = sectionNotes
    newSection[id].deleted = true
    newNotes[section] = newSection
    setNotes(newNotes)
  }
  return (
  <div>
    { open ? 
    <OpenSectionWrapper>
      <SectionHeaderWrapper>
        <SectionTitle>{section}</SectionTitle>
      </SectionHeaderWrapper>
      <NoteCardsWrapper>
        {sectionNotes.length === 0 
          ? "add some notes!" 
          : sectionNotes.map((note, i) => note.deleted 
            ? null 
            : <NoteCard 
                key={i} 
                id={i} 
                content={note.content}
                deleteNote={deleteNote}
              />)
        }
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

const NotesHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #D46146;
  padding: 5px;
`;

const NotesHeaderText = styled.div`
  white-space: pre-wrap; 
  flex-grow: 1;
  padding-left: 5px;
  text-align: left;
`;

const SectionInputWrapper = styled.div`
  height: 20px;
  display: flex;
  flex-direction: row;
`

const NotesHeader = ({currentOpen}) => {
  const [newSectionInput, setNewSectionInput] = useState("")
  const [openNewSectionInput, setOpenNewSectionInput] = useState(false)
  const buttonText = openNewSectionInput ? "x" : "New Section"

  const handleChange = (event) =>{
    setNewSectionInput(event.target.value);
  }
  const handleKeyDown = (evt) =>{
    if (evt.keyCode == 13) {
      evt.preventDefault()
      addNotesSectionFirebase(newSectionInput)
      // set notes section local
      setNewSectionInput('')
    }
  }
  const handleClick = () => {
    setOpenNewSectionInput(!openNewSectionInput)
  }
  return(
    <NotesHeaderWrapper>
      <NotesHeaderText>
        Writing to: <b>{currentOpen}</b>
      </NotesHeaderText>
      {openNewSectionInput 
        ? <SectionInputWrapper>
            <input value={newSectionInput} onChange={handleChange} onKeyDown={handleKeyDown}/>
            <EnterButton onClick={handleClick}>{buttonText}</EnterButton>
          </SectionInputWrapper>
        : <EnterButton onClick={handleClick}>{buttonText}</EnterButton>
      }
    </NotesHeaderWrapper>
  )
}

const Notes = () => {
  const [ notes, setNotes ] = useState({})
  const [ currentOpen, setCurrentOpen ] = useState("General")
  const [ notesSections, setNotesSections ] = useState([])
  useEffect(() => {
    setNotesFirebase(setNotes)
    setNotesSectionsFirebase(setNotesSections)
  }, [])

  const appendNote = (note) => {
    console.log('trying to add note to:', currentOpen)
    console.log(note)
    const newNotes = JSON.parse(JSON.stringify(notes))
    if (newNotes[currentOpen]) {
      newNotes[currentOpen].push(note)
    } else {
      newNotes[currentOpen] = [note]
    }
    
    setNotes(newNotes)
    addNoteFirebase((newNotes[currentOpen].length - 1).toString(), note, currentOpen)
  }

  const handleSectionClick = (section) => {
    setCurrentOpen(section)
  }
  console.log("Notes:", notes)
  return(
    <Wrapper>
      <NotesHeader currentOpen={currentOpen}/>
      <SectionsWrapper>
        { notesSections.map((section, i) =>
          <Section 
            key={i} 
            open={currentOpen === section} 
            section={section} 
            sectionNotes={notes[section] || []}
            handleSectionClick={handleSectionClick}
            setNotes={setNotes}
            notes={notes}
          /> 
        )}
      </SectionsWrapper>
      <NoteInput appendNote={appendNote}/>
    </Wrapper>
  )
}

export default Notes