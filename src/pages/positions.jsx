"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
  Upload,
  notification,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateAdventMutation,
  useDeleteAdventMutation,
  useGetAdventQuery,
  useUpdateAdventMutation,
} from "../services/api";

export default function AdvertisementDetail() {
  const { ids } = useParams();
  notification.config({
    placement: "top",
    duration: 3,
  });

  const {
    data,
    isLoading: getLoading,
    error: getError,
    refetch,
  } = useGetAdventQuery();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [createAdvent, { isLoading: postLoading }] = useCreateAdventMutation();
  const [updateAdvent, { isLoading: updating }] = useUpdateAdventMutation();
  const [deleteAdvent, { isLoading: deleteLoading }] =
    useDeleteAdventMutation();

  if (getLoading || postLoading || updating || deleteLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  if (getError)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Empty />
        <Alert message="Xatolik yuz berdi" type="warning" showIcon closable />
      </div>
    );

  const reklama = data?.results?.find(
    (item) => String(item.position) === String(ids)
  );

  const handleOpen = () => {
    if (reklama) {
      form.setFieldsValue({
        ...reklama,
        Shartnoma_muddati_boshlanishi: moment(
          reklama.Shartnoma_muddati_boshlanishi
        ),
        Shartnoma_tugashi: moment(reklama.Shartnoma_tugashi),
      });
    }
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("position", ids);
      formData.append("Reklama_nomi", values.Reklama_nomi);
      formData.append("Qurilma_turi", values.Qurilma_turi);
      formData.append("Ijarachi", values.Ijarachi);
      formData.append("Shartnoma_raqami", values.Shartnoma_raqami);
      formData.append(
        "Shartnoma_muddati_boshlanishi",
        values.Shartnoma_muddati_boshlanishi.format("YYYY-MM-DD")
      );
      formData.append(
        "Shartnoma_tugashi",
        values.Shartnoma_tugashi.format("YYYY-MM-DD")
      );
      formData.append("O_lchov_birligi", values.O_lchov_birligi);
      formData.append("Qurilma_narxi", values.Qurilma_narxi);
      formData.append("Egallagan_maydon", values.Egallagan_maydon || "-");
      formData.append("Shartnoma_summasi", values.Shartnoma_summasi);

      if (values.Shartnoma_fayl?.fileList?.[0]?.originFileObj) {
        formData.append(
          "Shartnoma_fayl",
          values.Shartnoma_fayl.fileList[0].originFileObj
        );
      }
      if (values.photo?.fileList?.[0]?.originFileObj) {
        formData.append("photo", values.photo.fileList[0].originFileObj);
      }

      formData.append("contact_number", values.contact_number);

      if (reklama) {
        await updateAdvent({ id: reklama.id, formData }).unwrap();
        notification.success({
          message: "Muvaffaqiyatli yangilandi",
        });
      } else {
        await createAdvent(formData).unwrap();
        notification.success({
          message: "Muvaffaqiyatli qo'shildi",
        });
      }

      await refetch();
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      notification.error({ message: "Xatolik yuz berdi" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvent(id).unwrap();
      notification.success({
        message: "Reklama o'chirildi",
      });
      refetch();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Xatolik yuz berdi",
        description: err?.data?.message || JSON.stringify(err),
      });
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      {reklama ? (
        <div>
          {/* Header Card with Action Buttons */}
          <Card
            className="mb-6  border-0 rounded-2xl overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <div className="relative">
                    <Image
                      src={reklama.photo || "/placeholder.svg"}
                      width={120}
                      height={120}
                      alt="reklama rasmi"
                      className="rounded-xl border-4 border-white/20 shadow-lg"
                      fallback="/impactful-advertisement.png"
                    />
                  </div>
                  <div className="text-white flex items-start flex-col h-full ">
                    <h1 className="text-[40px]/[40px] font-bold">
                      {reklama.Reklama_nomi}
                    </h1>
                    {/* <div className='flex gap-3 mb-3'>
											<Tag color='blue' className='px-3 py-1'>
												{reklama.Qurilma_turi}
											</Tag>
											<Tag color='green' className='px-3 py-1'>
												{reklama.O_lchov_birligi}
											</Tag>
										</div> */}
                    <p className="text-blue-100 text-3xl">
                      Ijarachi:{" "}
                      <span className="font-semibold">{reklama.Ijarachi}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <Space size="middle" className="flex h-full items-center">
                  <Tooltip title="Ma'lumotlarni tahrirlash">
                    <Button
                      variant="solid"
                      color="cyan"
                      ghost
                      icon={<EditOutlined />}
                      onClick={handleOpen}
                      size="large"
                      // className='border-white text-white hover:bg-white hover:text-blue-600'
                    >
                      Ma'lumotlarni tahrirlash
                    </Button>
                  </Tooltip>

                  <Popconfirm
                    title="Reklamani tugatish"
                    description="Haqiqatan ham bu reklamani tugatmoqchimisiz?"
                    onConfirm={() => handleDelete(reklama.id)}
                    okText="Ha, tugatish"
                    cancelText="Bekor qilish"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="Reklamani tugatish">
                      <Button
                        variant="solid"
                        color="red"
                        ghost
                        icon={<DeleteOutlined />}
                        size="large"
                      >
                        Shartnomani tugatish
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          </Card>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-15">
            {/* Contract Information */}
            <Card
              title="Shartnoma ma'lumotlari"
              className="shadow-md rounded-xl border-0 "
              headStyle={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <Typography.Text type="secondary">
                    Shartnoma raqami:
                  </Typography.Text>
                  <Typography.Text strong className="block text-lg">
                    {reklama.Shartnoma_raqami}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary">
                    Qurilma turi:
                  </Typography.Text>
                  <Typography.Text strong className="block text-lg">
                    {reklama.Qurilma_turi}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary">
                    O'lchov birligi:
                  </Typography.Text>
                  <Typography.Text strong className="block text-lg">
                    {reklama.O_lchov_birligi}
                  </Typography.Text>
                </div>
                <Divider className="my-2" />
                <div>
                  <Typography.Text type="secondary">
                    Boshlanish sanasi:
                  </Typography.Text>
                  <Typography.Text strong className="block">
                    {moment(reklama.Shartnoma_muddati_boshlanishi).format(
                      "DD.MM.YYYY"
                    )}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary">
                    Tugash sanasi:
                  </Typography.Text>
                  <Typography.Text strong className="block">
                    {moment(reklama.Shartnoma_tugashi).format("DD.MM.YYYY")}
                  </Typography.Text>
                </div>
              </Space>
            </Card>

            {/* Financial Information */}
            <Card
              title="Moliyaviy ma'lumotlar"
              className="shadow-md rounded-xl border-0"
              headStyle={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <Typography.Text type="secondary">
                    Qurilma narxi:
                  </Typography.Text>
                  <Typography.Text
                    strong
                    className="block text-lg text-green-600"
                  >
                    {reklama.Qurilma_narxi?.toLocaleString()} so'm
                  </Typography.Text>
                </div>
                <Divider className="my-2" />
                <div>
                  <Typography.Text type="secondary">
                    Shartnoma summasi:
                  </Typography.Text>
                  <Typography.Text
                    strong
                    className="block text-lg text-blue-600"
                  >
                    {reklama.Shartnoma_summasi?.toLocaleString()} so'm
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary">
                    Egallagan maydon:
                  </Typography.Text>
                  <Typography.Text strong className="block">
                    {reklama.Egallagan_maydon}
                  </Typography.Text>
                </div>
              </Space>
            </Card>

            {/* Contact Information */}
            <Card
              title="Aloqa ma'lumotlari"
              className="shadow-md rounded-xl border-0"
              headStyle={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <Typography.Text type="secondary">
                    Telefon raqami:
                  </Typography.Text>
                  <Typography.Text strong className="block text-lg">
                    {reklama.contact_number}
                  </Typography.Text>
                </div>
                <Divider className="my-2" />
                {reklama.Shartnoma_fayl && (
                  <div>
                    <Typography.Text type="secondary">
                      Shartnoma fayli:
                    </Typography.Text>
                    <Button
                      type="link"
                      href={reklama.Shartnoma_fayl}
                      target="_blank"
                      className="p-0 h-auto"
                    >
                      Faylni yuklab olish
                    </Button>
                  </div>
                )}
                {reklama.Shartnoma_fayl && (
                  <div>
                    <Typography.Text type="secondary">
                      Reklama rasmini yuklash:
                    </Typography.Text>
                    <Button
                      type="link"
                      href={reklama.photo}
                      target="_blank"
                      className="p-0 h-auto"
                    >
                      Faylni yuklab olish
                    </Button>
                  </div>
                )}
              </Space>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="text-center p-8 shadow-lg rounded-2xl border-0 max-w-md">
            <Empty
              description={
                <div className="mt-4">
                  <Typography.Title level={4} className="text-gray-600">
                    Ma'lumot topilmadi
                  </Typography.Title>
                  <Typography.Text className="text-gray-500">
                    Bu pozitsiya uchun reklama ma'lumotlari mavjud emas
                  </Typography.Text>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                onClick={handleOpen}
                icon={<PlusOutlined />}
                className="mt-4 px-8 py-2 h-auto rounded-lg"
              >
                Yangi reklama qo'shish
              </Button>
            </Empty>
          </Card>
        </div>
      )}

      {/* Enhanced Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            {reklama ? "Reklamani tahrirlash" : "Yangi reklama qo'shish"}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={700}
        className="top-8"
        okButtonProps={{
          size: "large",
          className: "px-8",
        }}
        cancelButtonProps={{
          size: "large",
          className: "px-8",
        }}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="Reklama_nomi"
              label="Reklama nomi"
              rules={[{ required: true, message: "Reklama nomini kiriting" }]}
            >
              <Input placeholder="Reklama nomini kiriting" size="large" />
            </Form.Item>

            <Form.Item
              name="Qurilma_turi"
              label="Qurilma turi"
              rules={[{ required: true, message: "Qurilma turini kiriting" }]}
            >
              <Input placeholder="Masalan: banner, monitor..." size="large" />
            </Form.Item>

            <Form.Item
              name="Ijarachi"
              label="Ijarachi"
              rules={[{ required: true, message: "Ijarachi nomini kiriting" }]}
            >
              <Input placeholder="Ijarachi nomi" size="large" />
            </Form.Item>

            <Form.Item
              name="Shartnoma_raqami"
              label="Shartnoma raqami"
              rules={[
                { required: true, message: "Shartnoma raqamini kiriting" },
              ]}
            >
              <Input placeholder="Shartnoma raqami" size="large" />
            </Form.Item>

            <Form.Item
              name="Shartnoma_muddati_boshlanishi"
              label="Shartnoma boshlanish sanasi"
              rules={[
                { required: true, message: "Boshlanish sanasini tanlang" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>

            <Form.Item
              name="Shartnoma_tugashi"
              label="Shartnoma tugash sanasi"
              rules={[{ required: true, message: "Tugash sanasini tanlang" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>

            <Form.Item
              name="O_lchov_birligi"
              label="O'lchov birligi"
              rules={[{ required: true, message: "O'lchov birligini tanlang" }]}
            >
              <Select placeholder="O'lchov birligini tanlang" size="large">
                <Select.Option value="komplekt">Komplekt</Select.Option>
                <Select.Option value="kv_metr">Kvadrat metr</Select.Option>
                <Select.Option value="dona">Dona</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="contact_number"
              label="Aloqa raqami"
              rules={[{ required: true, message: "Aloqa raqamini kiriting" }]}
            >
              <Input placeholder="+998..." size="large" />
            </Form.Item>

            <Form.Item
              name="Qurilma_narxi"
              label="Qurilma narxi (so'm)"
              rules={[{ required: true, message: "Qurilma narxini kiriting" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                size="large"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="Shartnoma_summasi"
              label="Shartnoma summasi (so'm)"
              rules={[
                { required: true, message: "Shartnoma summasini kiriting" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                size="large"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>

          <Form.Item name="Egallagan_maydon" label="Egallagan maydon">
            <Input placeholder="Masalan: 2.5 yoki -" size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="Shartnoma_fayl" label="Shartnoma fayli">
              <Upload beforeUpload={() => false}>
                <Button
                  icon={<UploadOutlined />}
                  size="large"
                  className="w-full"
                >
                  Fayl yuklash
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item name="photo" label="Reklama rasmi">
              <Upload listType="picture" beforeUpload={() => false}>
                <Button
                  icon={<UploadOutlined />}
                  size="large"
                  className="w-full"
                >
                  Rasm yuklash
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
