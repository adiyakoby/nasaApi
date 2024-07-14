# NASA Rover Images Viewer

Welcome to the NASA Rover Images Viewer! This project is a web application that interacts with the NASA API to fetch and display images taken by Mars rovers. Users can search for images by selecting a rover, specifying a date, and choosing a camera. The application also allows users to save their favorite images and view them in a carousel.

## Features

- **Search Images**: Retrieve images taken by Mars rovers by selecting the rover, date format (Earth date or Martian sol), and camera.
- **Save Images**: Save your favorite images and avoid duplicates.
- **Carousel View**: View saved images in a carousel for an enhanced browsing experience.
- **Error Handling**: Robust error handling ensures the application gracefully handles API errors and user mistakes.
- **Form Validation**: Ensures user input is valid before making API requests.

## Technologies Used

- JavaScript (ES6+)
- NASA API
- HTML5
- CSS3

## Project Structure

The project is modular, with each functionality encapsulated in its own module:

- **apiManager**: Handles API requests and error management.
- **imagesBank**: Manages the registration, retrieval, and saving of images.
- **roversBank**: Manages the registration and retrieval of rover data.
- **validation**: Handles various validation checks used in the application.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- A modern web browser (Chrome, Firefox, Edge, etc.)
- Internet connection to access the NASA API

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/nasaApi.git
    ```

2. Navigate to the project directory:
    ```bash
    cd nasaApi
    ```

3. Open `index.html` in your web browser to run the application.

### Usage

1. On the home page, select a rover, date format (Earth date or Martian sol), and camera from the dropdown menus.
2. Click the "Search" button to fetch images from the NASA API.
3. Save any image you like by clicking the save button on the image.
4. View saved images by clicking the "Saved Images" button and starting the carousel.
5. You can stop the carousel or go back to the search page using the respective buttons.

## Code Overview

### apiManager

Handles interactions with the NASA API, including fetching rover information and images based on user input.

### imagesBank

Manages the storage of fetched images and handles saving, retrieving, and deleting images.

### roversBank

Manages the storage and retrieval of rover data.

### validation

Handles various validation checks used in the application.

- **statusCheck**: Checks the HTTP response status and resolves or rejects the promise accordingly.
- **isSolDateValid**: Validates if the provided sol date is within the valid range.
- **isEarthDateValid**: Validates if the provided Earth date is within the specified range.
- **isFormValid**: Checks if the entire form is valid by validating each element.

### HTML Manager

Manages DOM manipulations, updating the UI based on user interactions and API responses.

### Event Listeners

Set up event listeners to handle user interactions such as form submissions, button clicks, and navigation.

## Error Handling

The application includes comprehensive error handling to manage API errors and display appropriate messages to the user.

## Future Improvements

- Enhance the UI with better styling and responsiveness.
- Add more filtering options for images.
- Implement user authentication to save images across sessions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [NASA API](https://api.nasa.gov/) for providing the data.
- [Adi Yakoby](https://github.com/adiyakoby) for developing the application.
