"use client"
import { useRef, useState } from 'react';
import "./App.css";

function App() {

  // Define and initialize the image data

  const [imageData, setImageData] = useState([{ items: 1, imagePath: "/images/image-11.webp" },
  { items: 2, imagePath: "/images/image-1.webp" },
  { items: 3, imagePath: "/images/image-2.webp" },
  { items: 4, imagePath: "/images/image-3.webp" },
  { items: 5, imagePath: "/images/image-4.webp" },
  { items: 6, imagePath: "/images/image-5.webp" },
  { items: 7, imagePath: "/images/image-6.webp" },
  { items: 8, imagePath: "/images/image-7.webp" },
  { items: 9, imagePath: "/images/image-8.webp" },
  { items: 10, imagePath: "/images/image-9.webp" },
  { items: 11, imagePath: "/images/image-10.webp" },
    // Add more image data as needed
  ]);

  // Create refs to track the drag and drop operations

  const dragimageData = useRef(0)
  const draggedOverimageData = useRef(0)
  // State variables to track drag-and-drop operations

  const [isDragging, setIsDragging] = useState(null);
  const [isDraggedOver, setIsDraggedOver] = useState(null);

  // State variables for selected and uploaded images

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Function to handle sorting images

  function handleSort() {
    const imageDataClone = [...imageData]
    const temp = imageDataClone[dragimageData.current]
    imageDataClone[dragimageData.current] = imageDataClone[draggedOverimageData.current]
    imageDataClone[draggedOverimageData.current] = temp
    setImageData(imageDataClone)
  }
  const handleImageSelection = (item) => {
    const selectedImageIndex = selectedImages.findIndex(
      (image) => image.items === item.items
    );
    if (selectedImageIndex === -1) {
      setSelectedImages([...selectedImages, item]);
    } else {
      const updatedSelectedImages = [...selectedImages];
      updatedSelectedImages.splice(selectedImageIndex, 1);
      setSelectedImages(updatedSelectedImages);
    }
  };

  // Function to handle image selection

  const handleDeleteImages = () => {
    const updatedImageData = imageData.filter(
      (item) =>
        !selectedImages.some((selectedItem) => selectedItem.items === item.items)
    );
    imageData.length = 0;
    imageData.push(...updatedImageData);
    setSelectedImages([]);
  };

  // Function to handle image click

  const handleImageClick = (item) => {
    handleImageSelection(item);
  };

  // Function to handle file selection

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const newUploadedImages = selectedFilesArray.map((file) => ({
      items: imageData.length + uploadedImages.length + 1,
      imagePath: URL.createObjectURL(file),
    }));

    setUploadedImages([...uploadedImages, ...newUploadedImages]);
    console.log(uploadedImages)
    event.target.value = "";
  };


  return (
    <div className="back">
      <div className="App">
        <div className="upper">
          {/* using condition to handle two diffrent div */}
          {selectedImages.length === 0 ? (
            <div className="h2div">
              <h2 id='gall'>Gallery</h2>
            </div>
          ) : (
            <div className="top">
              <label class="checkboxtop">
                <input type="checkbox" checked="checked" />
                <span class="checkmark">{selectedImages.length} files selected</span>
              </label>
              <div className="deletebutton" onClick={handleDeleteImages}>
                Delete File
              </div>
            </div>
          )}
        </div>
        {/* mapping the images from the data */}
        <div className="main">
          <div className="image-grid">
            {imageData.map((item, index) => (
              <div
                className={`image-grid-item ${index === 0 ? "image-grid-col-2 image-grid-row-2" : ""} 
            ${selectedImages.some((selectedItem) => selectedItem.items === item.items) ? "checked" : ""} 
            ${isDragging === index ? "dragging" : ""} 
            ${isDraggedOver === index ? "dragged-over" : ""}`}
                key={index}
                draggable
                onDragStart={() => {
                  dragimageData.current = index;
                  setIsDragging(index);
                }}
                onDragEnter={() => {
                  draggedOverimageData.current = index;
                  setIsDraggedOver(index);
                }}
                onDragEnd={() => {
                  handleSort();
                  setIsDragging(null);
                  setIsDraggedOver(null);
                }}
                onDragOver={(e) => e.preventDefault()}
              >

                <input
                  type="checkbox"
                  className="image-checkbox"
                  onChange={() => handleImageSelection(item)}
                  checked={selectedImages.some((selectedItem) => selectedItem.items === item.items)}
                />
                <img src={item.imagePath} onClick={() => handleImageClick(item)} alt={`Image ${item.items}`} />

              </div>
            ))}

            {/* Add the "Add Image" section */}
            <div className="add-image-button image-grid-item">
              <label htmlFor="file-input" className="">
                <span className="add-image-icon"><i class="fa-regular fa-image fa-2xs"></i></span>
                <div className='add-image'>Add Image</div>
              </label>
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/png , image/jpeg, image/webp"
                style={{ display: "none" }}

                onChange={onSelectFile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;