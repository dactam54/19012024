import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalDelete = ({ onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeleteClick = () => {
    // Khi người dùng nhấn nút xóa, set state để hiển thị form thông báo
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    // Xử lý logic xóa (giả định)
    onDelete(); // Gọi hàm xóa từ prop
    // Sau khi xóa, bạn có thể đặt lại state để ẩn form thông báo
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    // Nếu người dùng hủy bỏ xóa, set state để ẩn form thông báo
    setShowDeleteConfirmation(false);
  };

  const handleNo = () => {
    // Xử lý khi người dùng chọn "Không" và ẩn modal
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      {/* Nút xóa */}
      <Button variant="danger" onClick={handleDeleteClick}>
        Xóa
      </Button>

      {/* Form thông báo */}
      <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNo}>
            Không
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalDelete;
