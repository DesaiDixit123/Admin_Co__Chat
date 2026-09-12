import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { ErrorMessage, Field, Form, Formik, FieldArray } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from 'primereact/inputswitch';
import toast from 'react-hot-toast';
import {
  planSave,
  planGetOne,
  planFunctionalityListAll,
} from '../../Services/services';

const fallbackFunctionalities = [
  { label: "Chat", value: "Chat" },
  { label: "Audio", value: "Audio" },
  { label: "Video", value: "Video" },
  { label: "Session", value: "Session" },
  { label: "Community", value: "Community" },
  { label: "Marketplace", value: "Marketplace" },
  { label: "Broadcast", value: "Broadcast" },
];

const standardDurationTiers = [
  { label: "1 Month", days: 30, price: '' },
  { label: "3 Months", days: 90, price: '' },
  { label: "6 Months", days: 180, price: '' },
  { label: "12 Months (1 Year)", days: 365, price: '' },
];

const AddEditPlanSubscription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!id);
  const [functionalityOptions, setFunctionalityOptions] = useState(fallbackFunctionalities);
  const [funcIdMap, setFuncIdMap] = useState({});
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    planName: '',
    description: '',
    functionalities: [],
    durationTiers: standardDurationTiers,
    isDefault: false,
  });

  // Fetch available functionalities from backend
  useEffect(() => {
    const fetchFuncs = async () => {
      try {
        const res = await planFunctionalityListAll();
        if (res?.data?.IsSuccess && res?.data?.Data?.length > 0) {
          const map = {};
          const options = res.data.Data.map((f) => {
            map[f.name] = f._id;
            map[f._id] = f.name;
            return { label: f.name, value: f.name, id: f._id };
          });
          setFuncIdMap(map);
          setFunctionalityOptions(options);
        }
      } catch (err) {
        console.error("Failed to load functionalities:", err);
      }
    };
    fetchFuncs();
  }, []);

  // Fetch plan details in edit mode
  useEffect(() => {
    if (!id) return;
    const loadPlan = async () => {
      setPageLoading(true);
      try {
        const res = await planGetOne({ planId: id });
        if (res?.data?.IsSuccess && res?.data?.Data) {
          const p = res.data.Data;

          // Extract selected functionality names
          const selectedFuncs = (p.functionalities || []).map((f) => {
            const funcObj = f.functionalityId;
            return typeof funcObj === 'object' && funcObj?.name ? funcObj.name : funcObj;
          });

          // Extract duration tiers or map from existing pricing
          let tiers = [];
          if (p.pricing?.durationOptions && Array.isArray(p.pricing.durationOptions) && p.pricing.durationOptions.length > 0) {
            tiers = p.pricing.durationOptions.map((opt) => ({
              label: opt.label || `${opt.days} Days`,
              days: opt.days,
              price: opt.price ?? '',
            }));
          } else {
            tiers = [
              { label: "1 Month", days: 30, price: p.pricing?.oneMonthPrice ?? p.pricing?.monthlyPrice ?? '' },
              { label: "3 Months", days: 90, price: p.pricing?.threeMonthPrice ?? '' },
              { label: "6 Months", days: 180, price: p.pricing?.sixMonthPrice ?? '' },
              { label: "12 Months (1 Year)", days: 365, price: p.pricing?.twelveMonthPrice ?? p.pricing?.yearlyPrice ?? '' },
            ];
          }

          setInitialValues({
            planName: p.title || '',
            description: p.description?.replace(/<[^>]+>/g, '') || '',
            functionalities: selectedFuncs,
            durationTiers: tiers,
            isDefault: !!p.isDefault,
          });
        }
      } catch (err) {
        toast.error("Failed to load plan details");
      } finally {
        setPageLoading(false);
      }
    };
    loadPlan();
  }, [id]);

  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    planName: Yup.string().required('Plan Name is required'),
    description: Yup.string().required('Description is required'),
    functionalities: Yup.array()
      .of(Yup.string().required())
      .min(1, 'Select at least one functionality'),
    durationTiers: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required('Duration label is required'),
        days: Yup.number().typeError('Days must be a number').required('Days required').min(1, 'Min 1 day'),
        price: Yup.number().typeError('Price must be a number').required('Price is required').min(0, 'Min price is 0'),
      })
    ).min(1, 'Add at least one duration tier'),
  });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Map functionality names to MongoDB ObjectIds
      const mappedFunctionalities = values.functionalities.map((nameOrId) => {
        const mongoId = funcIdMap[nameOrId] || nameOrId;
        return { functionalityId: mongoId };
      });

      // Find standard prices from tiers for backward compatibility
      const tier30 = values.durationTiers.find((t) => Number(t.days) === 30);
      const tier90 = values.durationTiers.find((t) => Number(t.days) === 90);
      const tier180 = values.durationTiers.find((t) => Number(t.days) === 180);
      const tier365 = values.durationTiers.find((t) => Number(t.days) === 365);

      const oneMonth = tier30 ? Number(tier30.price) : Number(values.durationTiers[0]?.price || 0);
      const twelveMonth = tier365 ? Number(tier365.price) : Number(values.durationTiers[values.durationTiers.length - 1]?.price || 0);

      const payload = {
        title: values.planName,
        description: values.description,
        functionalities: mappedFunctionalities,
        pricing: {
          durationOptions: values.durationTiers.map((t) => ({
            label: t.label,
            days: Number(t.days),
            price: Number(t.price),
          })),
          oneMonthPrice: oneMonth,
          threeMonthPrice: tier90 ? Number(tier90.price) : 0,
          sixMonthPrice: tier180 ? Number(tier180.price) : 0,
          twelveMonthPrice: twelveMonth,
          monthlyPrice: oneMonth,
          yearlyPrice: twelveMonth,
        },
        isDefault: values.isDefault,
      };

      if (id) {
        payload.planId = id;
      }

      const res = await planSave(payload);
      if (res?.data?.IsSuccess) {
        toast.success(res.data.Message || (id ? 'Plan updated successfully!' : 'Plan created successfully!'));
        navigate('/plans-subscription');
      } else {
        toast.error(res?.data?.message || res?.data?.Message || 'Failed to save plan');
      }
    } catch (error) {
      console.error("Save Plan Error:", error);
      toast.error(error?.message || error?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header name="Plan Subscription" />

      <div className="p-5 md:p-6 lg:p-7 space-y-5 lg:space-y-7 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] overflow-y-auto bg-l4/60">
        {pageLoading ? (
          <div className="flex items-center justify-center p-12 text-g6">
            <span className="icon-swap animate-spin mr-2"></span> Loading plan details...
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="bg-white p-5 md:p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-l2 shadow-sm space-y-6">
                  {/* Form Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-l2">
                    <div>
                      <h4 className="text-18 md:text-22 font-bold text-g1">
                        {id ? "Edit Plan Subscription" : "Add Plan Subscription"}
                      </h4>
                      <p className="text-12 md:text-13 text-g6 mt-0.5">
                        Set plan features and day-wise duration pricing.
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link to="/plans-subscription" className="btn_secondary py-2 px-4">
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn_primary py-2 px-6"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Plan"}
                      </button>
                    </div>
                  </div>

                  {/* 1. Basic Plan Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Plan Name */}
                    <div className="relative">
                      <label className="label">
                        Plan Name <span className="text-red">*</span>
                      </label>
                      <Field
                        type="text"
                        name="planName"
                        className="input"
                        placeholder="e.g. Basic, Pro, Gold"
                      />
                      <ErrorMessage component="span" name="planName" className="text-red error" />
                    </div>

                    {/* Description */}
                    <div className="relative">
                      <label className="label">
                        Description <span className="text-red">*</span>
                      </label>
                      <Field
                        type="text"
                        name="description"
                        className="input"
                        placeholder="Short description of plan"
                      />
                      <ErrorMessage component="span" name="description" className="text-red error" />
                    </div>

                    {/* Functionalities */}
                    <div className="relative">
                      <label className="label">
                        Select Functionalities <span className="text-red">*</span>
                      </label>
                      <MultiSelect
                        value={values.functionalities}
                        options={functionalityOptions}
                        onChange={(e) => setFieldValue('functionalities', e.value)}
                        placeholder="Choose features..."
                        className="w-full input flex items-center"
                        display="chip"
                      />
                      <ErrorMessage component="span" name="functionalities" className="text-red error" />
                    </div>
                  </div>

                  {/* Info Notice: Shared Features */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-12 text-blue-900 flex items-start gap-2.5">
                    <span className="icon-info text-blue-600 text-16 mt-0.5 shrink-0"></span>
                    <div>
                      <p className="font-semibold">Plan Features are Common</p>
                      <p className="text-11 text-blue-800 mt-0.5">
                        All features selected above (Chat, Audio, Video, Session, Community, Marketplace, Broadcast) apply to all duration tiers below. Pricing varies based on the validity days.
                      </p>
                    </div>
                  </div>

                  {/* 2. Duration Tiers & Day-Wise Pricing */}
                  <div className="pt-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-15 md:text-16 font-bold text-g1">
                          Day-Wise Duration & Pricing
                        </h5>
                        <p className="text-12 text-g6">
                          Define price for each duration. Validity days begin when the user purchases the plan in the app.
                        </p>
                      </div>
                    </div>

                    <FieldArray name="durationTiers">
                      {({ push, remove }) => (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {values.durationTiers.map((tier, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-xl border border-l2 bg-l4/70 relative space-y-3 hover:border-primary/40 transition"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-13 font-bold text-g1">
                                    {tier.label}
                                  </span>
                                  {values.durationTiers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="text-g5 hover:text-red transition text-12 p-1"
                                      title="Remove this duration"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>

                                {/* Duration in Days */}
                                <div>
                                  <label className="text-[11px] font-semibold text-g5 block mb-1">
                                    Validity (Days) <span className="text-red">*</span>
                                  </label>
                                  <div className="relative">
                                    <Field
                                      type="number"
                                      name={`durationTiers[${index}].days`}
                                      className="input bg-white text-13 py-1.5"
                                      placeholder="e.g. 30"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-11 text-g6 pointer-events-none">
                                      Days
                                    </span>
                                  </div>
                                </div>

                                {/* Price for this Duration */}
                                <div>
                                  <label className="text-[11px] font-semibold text-g5 block mb-1">
                                    Price <span className="text-red">*</span>
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-14 font-semibold text-g5 pointer-events-none">
                                      ₹
                                    </span>
                                    <Field
                                      type="number"
                                      name={`durationTiers[${index}].price`}
                                      className="input bg-white text-13 py-1.5 pl-8"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Custom Duration Button */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  label: `Custom Period (${values.durationTiers.length + 1})`,
                                  days: 30,
                                  price: '',
                                })
                              }
                              className="inline-flex items-center gap-1.5 text-12 font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              <span className="icon-add text-14"></span>
                              <span>+ Add Another Duration Option</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-l2">
                    <Link to="/plans-subscription" className="btn_secondary py-2 px-4">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn_primary py-2 px-6"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : id ? "Update Plan" : "Save Plan"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};

export default AddEditPlanSubscription;