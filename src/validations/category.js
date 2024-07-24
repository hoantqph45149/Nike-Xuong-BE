import Joi from "joi";

export const categoryValidation = Joi.object({
  name: Joi.string().required().min(3).max(255).messages({
    "string.base": "Tên sản phẩm phải là một chuỗi",
    "string.empty": "Vui lòng nhập tên sản phẩm",
    "string.min": "Tên sản phẩm phải tối thiểu {#limit} ký tự",
    "string.max": "Tên sản phẩm phải tối đa {#limit} ký tự",
  }),
  description: Joi.string().messages({
    "string.base": "Mô tả phải là kiểu chuỗi",
  }),
});
