import { Input, Typography, Button, Form, message, Icon } from 'antd'
import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import Axios from 'axios';
const {TextArea} = Input;
const {title} = Typography;

const PrivateOptions = [
    {value: 0, label:"Private"},
    {value: 1, label: "Public"}
]

const   CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},

]

function VideoUploadPage() {


    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        console.log(e.currentTarget)
        setVideoTitle(e.currentTarget.value)
    }
    
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {

        let formData = new FormData;
        const config = {
            header: {'content-type' : 'multipart/form-data'}
        }
        formData.append("file", files[0])
 

        Axios.post('/api/video/uploads', formData, config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable) //라우터를 만들어야 함
                    .then(response => {
                        if(response.data.success) {
                            console.log(response.data)
                     

                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    }
                        else{
                            alert("썸네일 생성에 실패 했습니다.")
                        }                            
                    })





            } else{
                alert('비디오 업로드를 실패했습니다.')
            }
        })

    }


  return (
    <div style={{ maxWidth:'700px', margin: '2rem auto'}}> 
    <div style ={{textAlign: 'center', marginBottom:'2rem'}}>
        <title level={2}>Upload Video</title>
        </div>

        <Form onSubmit>
            <div style={{ display: 'flex', justifyContent:'space-between'}}>
                { /* drop zone */ }
                <Dropzone
                onDrop={onDrop}
                multiple={false} //영상 하나만
                maxSize={1000000000}
                >
                {({ getRootProps, getInputProps}) => (
                    <div style={{width: '320px', height: '240px', border:'1px solid lightgray',
                alignItems:'center',justifyContent:'center', display:'flex'}} {...getRootProps()}>
                    <Input {...getInputProps()} />
                    <Icon type="plus" style={{ fontSize:'3rem'}} />
                </div>
                )}


                </Dropzone>

                { /* Thumbnail */ } 
                {ThumbnailPath &&  //thumbnailpath 있을때만 렌더링
                <div>
                    <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                </div>
} 
        </div>
        
        <br />
        <br />
        <label>Title</label>
        <Input
            onChange={onTitleChange}
            value={VideoTitle}
        />
        <br />
        <br />       
        <label>Description</label>
        <TextArea
            onChange={onDescriptionChange}
            value={Description}
        />
        <br />
        <br />

        <select onChange>
            {PrivateOptions.map((item, index) => (
                <option key={index} value={item.value}>{item.label} </option>
            ))}
        </select>

        <br />
        <br />
        <select onChange>
            {CategoryOptions.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
            ))}
        </select>
        <br />
        <br />

        <button type='primary' size="large" onClick>
        Submit
        </button>
        </Form>
    
        </div>
        )
}

export default VideoUploadPage