
“⚠️ Note: The server may take 30–60s to load initially due to Render’s free hosting limitations.”

 [Live Website Link:](https:/)

admin@gmail.com
pass: 123

seller@gmail.com
pass: 123456,

buyer@gmail.com
pass: 123456

ashiqur@gmail.com/buyer/6033
sellerelectrospark@gmail.com/Electrospark/seller/7823
Or You can register as a new buyer or seller.

## Running Locally from a ZIP File

1. **Extract the ZIP:**
	- Unzip the downloaded project to a folder on your computer.

2. **Install Backend Dependencies:**
	- Open a terminal/command prompt.
	- Navigate to the `server` folder:
	  ```
	  cd server
	  npm install
	  ```
## Backend Dependencies

 The following npm packages are required for the backend (these are installed automatically with `npm install` in the `server` folder):

- express
- mongoose
- dotenv
- cors
- jsonwebtoken
- bcrypt
- multer
- multer-storage-cloudinary

3. **Configure Environment Variables:**
	 - Copy `server/.env.example` to `server/.env`:
		 - On Windows: manually copy and rename the file in File Explorer, or use:
			 ```
			 copy server\.env.example server\.env
			 ```
	 - Fill in your MongoDB and Cloudinary credentials in `server/.env`.
     
     # Example environment variables for eBay backend
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


4. **Start the Backend Server:**
	- In the `server` folder, run:
	  ```
	  npm start or node server.js
	  ```
	- The backend will run on `http://localhost:5000` by default.
    - click on the link and it will open in the browser.

5. **Open the Frontend:**
	- Open the `client/home.html` file directly in your browser, or use a static server to serve the `client` folder.
	

6. **Login/Register and Use the App:**
	- Register as a buyer, seller, or admin and start using the platform!


# eBay E-commerce Platform
A full-stack e-commerce web application with buyer, seller, and admin roles. Features product management, cart, order placement, admin approval, and image uploads to Cloudinary.

## Features
- Buyer, Seller, and Admin user roles
-  Admin dashboard for product approval and user management
- shop and seller dashboard with performance summary
- Favorites and product reviews and rating
- Product listing, filtering, sorting and search
- Add to cart, buy now, and order placement
- Product image uploads stored in Cloudinary
- Responsive, modern UI with dark mode

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Image Hosting:** Cloudinary
``

## Notes
- Product images are uploaded to Cloudinary via the backend.
- Only approved products are visible to buyers.
- Admin can approve/reject products and manage users.
- Seller can view their product history and performance.

![product page](</screenshots/Screenshot 2025-08-23 065443.png>)
![recommended product](</screenshots/Screenshot 2025-08-22 201434.png>)
![seller](</screenshots/Screenshot 2025-08-23 023557.png>)
![edit profile](</screenshots/Screenshot 2025-08-22 201714.png>)
![seller dashboard](</screenshots/Screenshot 2025-08-22 202046.png>)
![shop page](/screenshots/image.png)
![admin menu](</screenshots/Screenshot 2025-08-22 201704.png>)
![admin dashboard](</screenshots/Screenshot 2025-08-22 201631.png>)
![admin user manage](</screenshots/Screenshot 2025-08-22 201640.png>)
![order placement](</screenshots/Screenshot 2025-08-22 201549.png>)
![cart](</screenshots/Screenshot 2025-08-22 201519.png>)
