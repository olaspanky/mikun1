import React, { useState, useEffect } from "react";
import UploadService from "../services/FileUploadService";
import '../components/homecomp.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { WebcamCapture} from '../components/Webcam'




const ImageUpload = () => {

    const [toggle, setToggle] = useState(false)
    const [toggle2, setToggle2] = useState(false)

    const openDiv1=()=>{
        setToggle(true)
        setToggle2(false)
    }
    const openDiv2=()=>{
        setToggle(false)
        setToggle2(true)
    }

    const [name, setName] = useState('')


    const submitForm = () => {
        alert("Form submitted");
        setName('');
    }


const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [imageInfos, setImageInfos] = useState([]);

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setProgress(0);
    setMessage("");
  };

  const upload = () => {
    setProgress(0);

    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        return UploadService.getFiles();
      })
      .then((files) => {
        setImageInfos(files.data);
      })
      .catch((err) => {
        setProgress(0);

        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Could not upload the Image!");
        }

        setCurrentFile(undefined);
      });
  };

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setImageInfos(response.data);
    });
  }, []);

  
  return (
    <div  >

    


    <div >
    <h1 class="display-4 text-center  text-primary">Select Image Upload option</h1>
    <div className="bg-red-500">
    <button class="btn btn-primary m-3" type="button" value="Input"  onClick={openDiv1}>Upload from gallery</button>
    <button class="btn btn-primary m-3" type="button" value="Input" onClick={openDiv2}>Camera</button>
    </div>
    </div>

    <div class="container-fluid" className={` ${toggle ? 'flex' : 'hidden' }   m-3 `}>
      <div className="row ">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" accept="image/*" onChange={selectFile} />
          </label>
        </div>

        <div className="col-4">
          <button
            className="btn btn-success btn-sm"
            disabled={!currentFile}
            onClick={upload}
          >
            Upload
          </button>
        </div>
      </div>

      {currentFile && (
        <div className="progress my-3">
          <div
            className="progress-bar progress-bar-info"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      {previewImage && (
        <div>
          <img className="preview" src={previewImage} alt="" />
        </div>
      )}

      {message && (
        <div className="alert alert-secondary mt-3" role="alert">
          {message}
        </div>
      )}

      <div className="card mt-3">
        <div className="card-header">List of Images</div>
        <ul className="list-group list-group-flush">
          {imageInfos &&
            imageInfos.map((img, index) => (
              <li className="list-group-item" key={index}>
                <p>
                  <a href={img.url}>{img.name}</a>
                </p>
                <img src={img.url} alt={img.name} height="80px" />
              </li>
            ))}
        </ul>
      </div>
      </div>

      <div className={` ${toggle2 ? 'flex' : 'hidden' } m-3 `}>

      <div className="home-container">
            <div className="container">
                <div className="text">
                    <h1>Capture Image!</h1>
                    <form className="form">
                        <WebcamCapture/>
                        <input type="text" placeholder="Save As" onChange={(e) => setName(e.target.value)} />
                        <button type="submit" id="login-button" onClick={(e) => submitForm(e)}>Submit</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default ImageUpload;