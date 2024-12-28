import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useSelector } from 'react-redux';


function Footer({companyName }) {
  
  const [footerImage, setFooterImage] = useState('');
  const userName = useSelector(state => state.auth.user.id);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post('https://quotation.queuemanagementsystemdg.com/api/company-header-footer', {
          company_name: companyName
        });

        if (response.status === 200) {
          const { footer_img } = response.data;
          setFooterImage(footer_img);
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
    
  
      <div>
      
        <img src={footerImage} alt="Footer" className='footer-image' />
      </div>
    </Wrapper>
  );
}

export default Footer;
const Wrapper =  styled.div`
.footer-image {
  width: 12%; 
}

/* Adjust image size for print */
@media print {
  .footer-image {
    width: 100% !important; 
    height: auto !important; 
  }
}


`