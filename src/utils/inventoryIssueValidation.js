
export function validateInventoryIssueForm(data) {
  const errors = [];

  // Warehouse validation
  if (!data.warehouseId || data.warehouseId.trim() === "") {
    errors.push({ field: "warehouseId", message: "Kho xuất là bắt buộc" });
  }

  // Department validation
  if (!data.department || data.department.trim() === "") {
    errors.push({
      field: "department",
      message: "Khoa/Phòng nhận là bắt buộc",
    });
  } else if (data.department.length > 200) {
    errors.push({
      field: "department",
      message: "Tên khoa/phòng không được vượt quá 200 ký tự",
    });
  }

  // Issue date validation
  if (!data.issueDate) {
    errors.push({ field: "issueDate", message: "Ngày xuất là bắt buộc" });
  } else {
    const issueDate = new Date(data.issueDate);
    if (isNaN(issueDate.getTime())) {
      errors.push({
        field: "issueDate",
        message: "Định dạng ngày không hợp lệ",
      });
    }
  }

  // Notes validation
  if (data.notes && data.notes.length > 1000) {
    errors.push({
      field: "notes",
      message: "Ghi chú không được vượt quá 1000 ký tự",
    });
  }

  // Items validation
  if (!data.items || data.items.length === 0) {
    errors.push({
      field: "items",
      message: "Danh sách sản phẩm không được để trống",
    });
  } else {
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push({
          field: `items[${index}].productId`,
          message: `Sản phẩm #${index + 1}: Mã sản phẩm là bắt buộc`,
        });
      }

      if (!item.quantity || item.quantity <= 0) {
        errors.push({
          field: `items[${index}].quantity`,
          message: `Sản phẩm #${index + 1}: Số lượng phải lớn hơn 0`,
        });
      }

      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push({
          field: `items[${index}].unitPrice`,
          message: `Sản phẩm #${index + 1}: Đơn giá phải lớn hơn hoặc bằng 0`,
        });
      }
    });
  }

  return errors;
}

export function validateStockAvailability(items) {
  const errors = [];

  items.forEach((item, index) => {
    if (item.quantity > item.availableQty) {
      const shortage = item.quantity - item.availableQty;
      errors.push({
        field: `items[${index}].quantity`,
        message: `${item.productName}: Không đủ tồn kho. Yêu cầu: ${item.quantity}, Có sẵn: ${item.availableQty}, Thiếu: ${shortage}`,
      });
    }
  });

  return errors;
}


export function validateField(field, value, rules = {}) {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === "")) {
    return rules.requiredMessage || `${field} là bắt buộc`;
  }

  // Min length validation
  if (rules.minLength && value && value.length < rules.minLength) {
    return `${field} phải có ít nhất ${rules.minLength} ký tự`;
  }

  // Max length validation
  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `${field} không được vượt quá ${rules.maxLength} ký tự`;
  }

  // Min value validation
  if (rules.min !== undefined && value < rules.min) {
    return `${field} phải lớn hơn hoặc bằng ${rules.min}`;
  }

  // Max value validation
  if (rules.max !== undefined && value > rules.max) {
    return `${field} phải nhỏ hơn hoặc bằng ${rules.max}`;
  }

  // Pattern validation
  if (rules.pattern && value && !rules.pattern.test(value)) {
    return rules.patternMessage || `${field} không hợp lệ`;
  }

  return null;
}

export function formatValidationErrors(errors) {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {});
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
