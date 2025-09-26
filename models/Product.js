class Product {
    constructor(id, name, description, price, stockQuantity, category, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    isInStock() {
        return this.stockQuantity > 0;
    }

    canFulfillOrder(quantity) {
        return this.isInStock() && this.stockQuantity >= quantity;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: parseFloat(this.price),
            stockQuantity: this.stockQuantity,
            category: this.category,
            inStock: this.isInStock(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Product;
