class Order {
    constructor(id, userId, totalAmount, status, shippingAddress, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    canBeCancelled() {
        return ['pending', 'confirmed'].includes(this.status);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            totalAmount: parseFloat(this.totalAmount),
            status: this.status,
            shippingAddress: this.shippingAddress,
            canBeCancelled: this.canBeCancelled(),
            itemCount: this.items.length,
            items: this.items,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Order;
