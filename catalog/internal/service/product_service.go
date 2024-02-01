package service

import (
	"github.com/almerindopaixao/fclx17/catalog/internal/database"
	"github.com/almerindopaixao/fclx17/catalog/internal/entity"
)

type ProductService struct {
	productDB database.ProductDB
}

func NewProductService(productDB database.ProductDB) *ProductService {
	return &ProductService{productDB: productDB}
}

func (ps *ProductService) GetProducts() ([]*entity.Product, error) {
	products, err := ps.productDB.GetProducts()

	if err != nil {
		return nil, err
	}

	return products, nil
}

func (ps *ProductService) GetProductsByCategoryID(categoryID string) ([]*entity.Product, error) {
	products, err := ps.productDB.GetProductByCategoryID(categoryID)

	if err != nil {
		return nil, err
	}

	return products, nil
}

func (ps *ProductService) CreateProduct(
	name,
	description string,
	price float64,
	categoryID,
	imageURL string,
) (*entity.Product, error) {
	product := entity.NewProduct(name, description, price, categoryID, imageURL)

	if _, err := ps.productDB.CreateProduct(product); err != nil {
		return product, err
	}

	return product, nil
}

func (ps *ProductService) GetProduct(id string) (*entity.Product, error) {
	product, err := ps.productDB.GetProduct(id)

	if err != nil {
		return nil, err
	}

	return product, nil
}
