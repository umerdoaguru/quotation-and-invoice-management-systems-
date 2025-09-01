// import React, { useEffect, useState } from 'react'
// import img from '../images/5.png'
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import styled from 'styled-components';
// function Header( companyName) {
//   const [headerImage, setHeaderImage] = useState('');
//   const userName = useSelector(state => state.auth.user.id);


//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.post(`https://quotation-generator.dentalguru.software/api/company-header-footer`);

//         if (response.status === 200) {
//           const { header_img} = response.data;

//           // Update state with image URLs
//           setHeaderImage(header_img);
          
//         } else {
//           console.error('Error fetching header and footer images:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching header and footer images:', error.message);
//       }
//     };

//     // Fetch images on component mount
//     fetchImages();
//   }, []);
//   return (
//     <Wrapper>
//     <div className="">
//     <div >
       
//         <img src={headerImage} alt="Header" style={{ maxWidth: '100%' }} />
//       </div>
     
//     </div>
   
    
    
//     </Wrapper>
//   )
// }

// export default Header

// const Wrapper =  styled.div`
// img{
//   width: -webkit-fill-available;


// }
// `



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import styled from 'styled-components';

// function Header({ companyName }) {
//   const [headerImage, setHeaderImage] = useState('');

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.post('https://quotation-generator.dentalguru.software/api/company-header-footer', {
//           company_name_branch: companyName // Send the company name in the request body
//         });

//         if (response.status === 200) {
//           const { header_img } = response.data;
//           console.log(response);

//           // Update state with the header image URL
//           setHeaderImage(header_img);
//         } else {
//           console.error('Error fetching header and footer images:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching header and footer images:', error.message);
//       }
//     };

//     // Fetch images on component mount
//     fetchImages();
//   }, [companyName]); // Add companyName to the dependency array

//   return (
//     <Wrapper>
//       <div>
//         <img src={headerImage} alt="Header" style={{ maxWidth: '100%' }} />
//       </div>
//     </Wrapper>
//   );
// }

// export default Header;

// const Wrapper = styled.div`
//   img {
//     width: -webkit-fill-available;
//   }
// `;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

function Header({ companyName , quotationName  }) {
  const [headerImage, setHeaderImage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post('https://quotation-generator.dentalguru.software/api/company-header-footer', {
          company_name: companyName
        });
        

        if (response.status === 200) {
          const { header_img } = response.data;

          setHeaderImage(header_img);
        } else {
          console.error('Error fetching header and footer images:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching header and footer images:', error.message);
      }
    };

    fetchImages();
  }, [companyName]);

  return (
    <Wrapper>
      {/* <div>
        <img src={headerImage} alt="Header" style={{ maxWidth: '100%' }} />
      </div> */}
    {headerImage && (
  <div>
    <img 
      src={headerImage} 
      className="header-image img " 
      alt="Header" 
    />
  </div>
)}


             {/* <div className="bottomleft text-white">
                <h1>Plans & Quotation for</h1>
                <h1 className="hdd">{quotationName}</h1>
              </div> */}
       
    
       
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div`
  img {
    width: -webkit-fill-available;
  }
  .container-fluid {
    position: relative;
  }

  .bottomleft {
    position: absolute;
    bottom: 0px;
    left: 40px;
    font-size: 18px;
  }
  .hdd {
    font-size: 3rem;
  }
  .header-image {
  width: 12%;
}


@media print {
  .header-image {
    width: 100% !important; 
    height: auto !important;
  }
}


`;
