import React from 'react';
import '../../styles/exploreCategory.css'; // Assuming CSS is in a separate file
import i1 from '../../assets/cc1.webp';
import i2 from '../../assets/cc2.webp';
import i3 from '../../assets/cc3.webp';
import i4 from '../../assets/cc4.webp';
import i5 from '../../assets/cc5.webp';
import i6 from '../../assets/cc6.webp';

const categories = [
  { id: 1, name: 'Toys', discount: 'Upto 85% Off', imageUrl: i1 },
  { id: 2, name: 'Fashion', discount: 'Upto 50% Off', imageUrl: i2 },
  { id: 3, name: 'Electronics', discount: 'Upto 95% Off', imageUrl: i3 },
  { id: 4, name: 'Kitchen Items', discount: '', imageUrl: i4 },
  { id: 5, name: 'Makeup', discount: 'Upto 50% Off', imageUrl: i5 },
  { id: 6, name: 'Home Needs', discount: '', imageUrl: i6 },
];

const ExploreCategory = () => {
  return (
    <div style={{ maxWidth: "100vw",marginTop:"40px"}}>
      <div className="explore-category">
        <div className='explore-category-title'>Explore New Category</div>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-item" key={category.id}>
              <img src={category.imageUrl} alt={category.name} className="category-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategory;
