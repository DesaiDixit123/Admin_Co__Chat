import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { InputSwitch } from 'primereact/inputswitch';
import toast from 'react-hot-toast';
import { gstGet, gstSave, planListAll } from '../../Services/services';

const standardRates = [0, 5, 12, 18, 28];

const GSTManagement = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [plans, setPlans] = useState([]);

  const [formData, setFormData] = useState({
    percentage: 0,
    status: true,
    label: 'GST',
    gstNumber: '',
  });

  const fetchGSTAndPlans = async () => {
    try {
      setFetching(true);
      const [gstRes, plansRes] = await Promise.all([
        gstGet(),
        planListAll({}).catch(() => null),
      ]);

      if (gstRes?.data?.IsSuccess && gstRes?.data?.Data) {
        const d = gstRes.data.Data;
        setFormData({
          percentage: Number(d.percentage) || 0,
          status: typeof d.status === 'boolean' ? d.status : true,
          label: d.label || 'GST',
          gstNumber: d.gstNumber || '',
        });
      }

      if (plansRes?.data?.IsSuccess && Array.isArray(plansRes?.data?.Data)) {
        setPlans(plansRes.data.Data);
      }
    } catch (err) {
      console.error('Failed to fetch GST settings or plans:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchGSTAndPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'percentage') {
      let num = parseFloat(value);
      if (isNaN(num) || num < 0) num = 0;
      if (num > 100) num = 100;
      setFormData((prev) => ({ ...prev, percentage: num }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setLoading(true);
      const res = await gstSave(formData);
      if (res?.data?.IsSuccess) {
        toast.success(res?.data?.Message || 'GST settings saved successfully!');
      } else {
        toast.error(res?.data?.Message || 'Failed to save GST settings');
      }
    } catch (err) {
      console.error('Error saving GST:', err);
      toast.error('Something went wrong while saving GST settings');
    } finally {
      setLoading(false);
    }
  };

  const isGstApplied = formData.status && Number(formData.percentage) >= 1;
  const rate = Number(formData.percentage) || 0;
  const taxLabel = formData.label && formData.label.trim() !== '' ? formData.label.trim() : 'GST';

  // Extract tiers from real plans or provide fallback
  const displayItems = [];
  if (plans && plans.length > 0) {
    plans.forEach((plan) => {
      const p = plan.pricing || {};
      if (p.durationOptions && Array.isArray(p.durationOptions) && p.durationOptions.length > 0) {
        p.durationOptions.forEach((opt) => {
          if (opt && opt.price !== undefined && opt.price !== null) {
            displayItems.push({
              planTitle: plan.title,
              isDefault: plan.isDefault,
              durationLabel: opt.label || `${opt.days} Days`,
              basePrice: Number(opt.price) || 0,
            });
          }
        });
      } else {
        const p1 = p.oneMonthPrice ?? p.monthlyPrice ?? 0;
        const p3 = p.threeMonthPrice ?? 0;
        const p6 = p.sixMonthPrice ?? 0;
        const p12 = p.twelveMonthPrice ?? p.yearlyPrice ?? 0;

        if (p1 > 0) displayItems.push({ planTitle: plan.title, isDefault: plan.isDefault, durationLabel: '1 Month (30 Days)', basePrice: p1 });
        if (p3 > 0) displayItems.push({ planTitle: plan.title, isDefault: plan.isDefault, durationLabel: '3 Months (90 Days)', basePrice: p3 });
        if (p6 > 0) displayItems.push({ planTitle: plan.title, isDefault: plan.isDefault, durationLabel: '6 Months (180 Days)', basePrice: p6 });
        if (p12 > 0) displayItems.push({ planTitle: plan.title, isDefault: plan.isDefault, durationLabel: '12 Months (1 Year)', basePrice: p12 });
      }
    });
  }

  // Fallback if no plans are configured yet
  const previewList = displayItems.length > 0 ? displayItems : [
    { planTitle: 'Basic Plan', durationLabel: '1 Month (30 Days)', basePrice: 99 },
    { planTitle: 'Pro Plan', durationLabel: '3 Months (90 Days)', basePrice: 249 },
    { planTitle: 'Enterprise Plan', durationLabel: '12 Months (1 Year)', basePrice: 999 },
  ];

  return (
    <>
      <Header name="Master / GST Management" />

      <div className="p-5 md:p-6 lg:p-7 space-y-5 lg:space-y-6 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] overflow-y-auto bg-l4/60">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Top Title Banner */}
          <div className="bg-white p-5 md:p-6 rounded-xl lg:rounded-2xl border border-l2 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-12 text-g6 mb-1">
                <span>Master</span>
                <span>/</span>
                <span className="text-g1 font-medium">GST Management</span>
              </div>
              <h3 className="text-20 md:text-24 font-bold text-g1">
                Goods & Services Tax (GST) Configuration
              </h3>
              <p className="text-13 text-g6 mt-1">
                Set the GST percentage applied to membership plans in the mobile application.
              </p>
            </div>

            {/* Top CTA & Status */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-xl text-12 font-bold ${
                  isGstApplied
                    ? 'bg-green/10 text-green border border-green/30'
                    : 'bg-l3 text-g5 border border-l2'
                }`}
              >
                {isGstApplied ? `● ${rate}% GST Active` : '○ 0% (No Tax Applied)'}
              </span>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || fetching}
                className="btn_primary py-2 px-5 flex items-center space-x-1.5 shadow-sm"
              >
                {loading && <span className="icon-swap animate-spin mr-1"></span>}
                <span>Save Settings</span>
              </button>
            </div>
          </div>

          {fetching ? (
            <div className="bg-white p-12 rounded-xl text-center text-g6 border border-l2">
              <span className="icon-swap animate-spin mr-2"></span> Loading GST configuration...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Settings Card */}
              <div className="bg-white p-5 md:p-6 lg:p-7 rounded-xl lg:rounded-2xl border border-l2 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-l2">
                  <div>
                    <h4 className="text-16 md:text-18 font-bold text-g1">
                      Tax Configuration
                    </h4>
                    <p className="text-12 text-g6 mt-0.5">
                      Configure tax rate, status, and display settings.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 bg-l4 px-3.5 py-1.5 rounded-xl border border-l2">
                    <span className="text-13 font-semibold text-g1">GST Status:</span>
                    <InputSwitch
                      checked={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* GST Percentage */}
                  <div className="space-y-2">
                    <label className="label font-semibold text-g1">
                      GST Percentage (%) <span className="text-red">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0"
                        className="input pr-10 font-medium"
                        required
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-g5 font-bold text-14">
                        %
                      </span>
                    </div>

                    {/* Quick select rate buttons */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-11 text-g6 font-medium">Quick Select:</span>
                      {standardRates.map((r) => {
                        const isSelected = Number(formData.percentage) === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, percentage: r }))}
                            className={`px-3 py-1 text-12 font-bold rounded-lg border transition ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-white text-g1 border-l2 hover:bg-l3 hover:border-g7'
                            }`}
                          >
                            {r}%
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tax Label */}
                  <div className="space-y-2">
                    <label className="label font-semibold text-g1">
                      Tax Display Label
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      placeholder="e.g. GST, Tax, IGST"
                      className="input font-medium"
                    />
                    <p className="text-11 text-g6">
                      This label will appear next to the tax line item in the mobile application.
                    </p>
                  </div>

                  {/* GSTIN / Tax Number */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="label font-semibold text-g1">
                      GSTIN / Business Tax Identification Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="e.g. 24ABCDE1234F1Z5"
                      className="input uppercase font-medium"
                    />
                    <p className="text-11 text-g6">
                      Optional identification number recorded for business receipts and invoices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Improved Clean Plan Calculation Table */}
              <div className="bg-white p-5 md:p-6 lg:p-7 rounded-xl lg:rounded-2xl border border-l2 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-l2 gap-2">
                  <div>
                    <h4 className="text-16 font-bold text-g1">
                      Membership Plans & GST Breakdown
                    </h4>
                    <p className="text-12 text-g6 mt-0.5">
                      {isGstApplied
                        ? `Live preview showing how the ${rate}% ${taxLabel} is applied on plans in the mobile app.`
                        : 'GST is currently 0% (or disabled). Mobile app will only show base price.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-12 text-g6 font-medium">Applied Rate:</span>
                    <span className="bg-l3 text-g1 font-bold text-12 px-2.5 py-0.5 rounded border border-l2">
                      {rate}% {taxLabel}
                    </span>
                  </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto border border-l2 rounded-xl">
                  <table className="w-full text-left text-13">
                    <thead className="bg-l4 border-b border-l2 text-g5 font-semibold text-12 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Plan Name</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4 text-right">Base Price</th>
                        <th className="py-3 px-4 text-right">
                          {isGstApplied ? `+ ${rate}% ${taxLabel}` : 'GST (0%)'}
                        </th>
                        <th className="py-3 px-4 text-right">Total Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-l2">
                      {previewList.map((item, idx) => {
                        const gstAmount = isGstApplied ? (item.basePrice * rate) / 100 : 0;
                        const totalPayable = item.basePrice + gstAmount;

                        return (
                          <tr key={idx} className="hover:bg-l4/60 transition">
                            <td className="py-3 px-4 font-semibold text-g1">
                              <div className="flex items-center gap-2">
                                <span>{item.planTitle}</span>
                                {item.isDefault && (
                                  <span className="text-10 bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-g6">{item.durationLabel}</td>
                            <td className="py-3 px-4 text-right font-medium text-g1">
                              ₹{item.basePrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              {isGstApplied ? (
                                <span className="text-primary font-semibold">
                                  + ₹{gstAmount.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-g6 text-12">None (0%)</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-14 text-g1">
                              ₹{totalPayable.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={fetchGSTAndPlans}
                  disabled={loading}
                  className="btn_secondary py-2.5 px-5"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn_primary py-2.5 px-7 flex items-center space-x-2"
                >
                  {loading && <span className="icon-swap animate-spin mr-1"></span>}
                  <span>Save GST Settings</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </>
  );
};

export default GSTManagement;
