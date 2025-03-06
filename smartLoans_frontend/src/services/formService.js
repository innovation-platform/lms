export const prepareFormData = (formData, files) => {
    const formDataToSend = new FormData();
     
    // Add form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
     
    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    });
     
    return formDataToSend;
  };
  