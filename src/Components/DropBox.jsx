import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

export const DropBox = ({className}) =>{
const [files, setFiles] = useState([]);
const [rejected, setRejected] = useState([])
const [copies, setCopies] = useState({});

const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
  if (acceptedFiles?.length) {
    setFiles(previousFiles => [
      ...previousFiles,
      ...acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    ])
  }
  if (rejectedFiles?.length) {
    setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
    console.log('Nieodpowiedni plik')
  }
}, [])

      const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop,
        noClick: true
      })

      const removeFile = name => {
        setFiles(files => files.filter(file => file.name !== name))
      }

      const handleChange = (event, fileName) => {
        setCopies(prevCopies => ({
          ...prevCopies,
          [fileName]: event.target.value
        }));
      };

      const handlePrint = () => {
        window.print();
      };
    
      return (
        <form>
        <div {...getRootProps({
            className: className
          })} >
          <input {...getInputProps()} />
          {/* {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          } */}
    
        <ul className="list">
        {files.map(file => (
          <li key={file.name} className="list-item">
            <input
      className="copies-input"
      type="text"
      name="copies"
      value={copies[file.name] || 'X1'}
      onChange={e => handleChange(e, file.name)}
    />
            <Image
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                // onLoad={() => {
                //   URL.revokeObjectURL(file.preview)
                // }}
                className='image'
              />
           
              <button
                type='button'
                className='remove-btn'
                onClick={() => removeFile(file.name)}
              >
                <XMarkIcon className='remove-icon' />
              </button>
          </li>
          )
        )}
          </ul>
          </div>
          <button className="print-btn" onClick={handlePrint}>Print</button>
        </form>
      )
}