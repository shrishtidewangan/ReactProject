import React, { useState, useEffect } from "react";


export const Practice = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const fetchApi = async () => {
        try {
            const response = await fetch('https://dummyjson.com/products');
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data.products;
        } catch (err) {
            setError(err.message);
            throw err; // Rethrow the error to be caught in useEffect
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                const list = await fetchApi();
                setProducts(list);
                setFilteredProducts(list);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const getUniqueData = (data, property) => {
        const uniqueValues = data.map(item => item[property]);
        return ["All", ...new Set(uniqueValues)];
    };

    const categoryOnlyData = getUniqueData(products, "category");

    useEffect(() => {
        let filteredData = products.filter(product =>
            product.title.toLowerCase().includes(search.toLowerCase())
        );

        if (selectedCategory !== "All") {
            filteredData = filteredData.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filteredData);
    }, [search, selectedCategory, products]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <section className="container">
                <div className="searchbar">
                    <input 
                        type="text" 
                        placeholder="Search product" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
                <div>
                    {/* <h3>Category</h3> */}
                    <div>
                        {categoryOnlyData.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className={selectedCategory === category ? "active" : ""}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <ul className="cards">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="productCard">
                            <img className="productImage"
                                src={product.images} 
                                alt={product.title} 
                                width="300" 
                                height="300" 
                            />
                            <h2 className="productName">{product.title}</h2>
                            <div className="displayStack__1">
                                <div className="productCategory">Category: {product.category}</div>
                                <div className="productPrice">Price: ${product.price}</div>
                            </div>
                            
                        </div>
                    ))}
                </ul>
            </section>   
        </div>
    );
};


