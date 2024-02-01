package database

import (
	"database/sql"

	"github.com/almerindopaixao/fclx17/catalog/internal/entity"
)

type ProductDB struct {
	db *sql.DB
}

func NewProductDB(db *sql.DB) *ProductDB {
	return &ProductDB{db: db}
}

func (pd *ProductDB) GetProducts() ([]*entity.Product, error) {
	query := "SELECT id, name, description, price, category_id, image_url FROM products"
	rows, err := pd.db.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var products []*entity.Product

	for rows.Next() {
		var product entity.Product
		if err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Description,
			&product.Price,
			&product.CategoryID,
			&product.ImageURL,
		); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (pd *ProductDB) GetProduct(id string) (*entity.Product, error) {
	query := "SELECT id, name, description, price, category_id, image_url FROM products WHERE id = ?"
	var product entity.Product

	if err := pd.db.QueryRow(
		query,
		id,
	).Scan(
		&product.ID,
		&product.Name,
		&product.Description,
		&product.Price,
		&product.CategoryID,
		&product.ImageURL,
	); err != nil {
		return nil, err
	}

	return &product, nil
}

func (pd *ProductDB) GetProductByCategoryID(categoryID string) ([]*entity.Product, error) {
	query := "SELECT id, name, description, price, category_id, image_url FROM products WHERE category_id = ?"
	rows, err := pd.db.Query(query, categoryID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var products []*entity.Product

	for rows.Next() {
		var product entity.Product
		if err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Description,
			&product.Price,
			&product.CategoryID,
			&product.ImageURL,
		); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (pd *ProductDB) CreateProduct(product *entity.Product) (*entity.Product, error) {
	query := "INSERT INTO products (id, name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)"
	if _, err := pd.db.Exec(
		query,
		product.ID,
		product.Name,
		product.Description,
		product.Price,
		product.CategoryID,
		product.ImageURL,
	); err != nil {
		return nil, err
	}

	return product, nil
}
