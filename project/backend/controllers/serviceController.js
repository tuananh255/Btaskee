const Service = require("../models/ServiceModel");

// Lấy tất cả dịch vụ
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy dịch vụ theo id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới dịch vụ
const createService = async (req, res) => {
  try {
    const { name, description, price, 
      // duration,
       active, status } = req.body;
    const newService = new Service({ name, description, price, active, status });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật dịch vụ
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const { name, description, price, active, status } = req.body;
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    // if (duration !== undefined) service.duration = duration;
    if (active !== undefined) service.active = active;
    if (status !== undefined) service.status = status;

    await service.save();
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa dịch vụ
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  deleteService,updateService,createService,getServiceById,getAllServices
}