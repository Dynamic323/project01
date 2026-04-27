import api from "../api";

export const apiService = (dashboardContext) => {
    const { getValue, setValue } = dashboardContext || {};

    return {
        // ---- AUTH ----
        login: async (email, password) => {
            const res = await api.post("/api/auth/login", { email, password });
            return res.data;
        },
        register: async (email, displayName, password) => {
            const res = await api.post("/api/auth/register", { email, displayName, password });
            return res.data;
        },
        getMe: async (token) => {
            const res = await api.get("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        updateProfile: async (data, token) => {
            const res = await api.put("/api/auth/update-profile", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (setValue) {
                setValue("user_uploads_all", null);
                setValue("user_uploads_files", null);
                setValue("user_uploads_texts", null);
                setValue("user_storage_stats", null);
            }
            return res.data;
        },

        // ---- UPLOADS ----
        upload: async (formData, token) => {
            const res = await api.post("/api/uploads", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            // Invalidate cache for history/files when new upload happens
            if (setValue) {
                setValue("user_uploads_all", null);
                setValue("user_uploads_files", null);
                setValue("user_uploads_texts", null);
                setValue("user_storage_stats", null);
            }
            return res.data;
        },

        // ---- DATA RETRIEVAL (With Caching) ----
        getUserAll: async (userId, token, forceRefresh = false) => {
            const cacheKey = `user_uploads_all`;
            if (!forceRefresh && getValue && getValue(cacheKey)) {
                return getValue(cacheKey);
            }
            const res = await api.get(`/api/users/${userId}/uploads`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.uploads || [];
            if (setValue) setValue(cacheKey, data);
            return data;
        },

        getUserFiles: async (userId, token, forceRefresh = false) => {
            const cacheKey = `user_uploads_files`;
            if (!forceRefresh && getValue && getValue(cacheKey)) {
                return getValue(cacheKey);
            }
            const res = await api.get(`/api/users/${userId}/uploads/files`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.files || [];
            if (setValue) setValue(cacheKey, data);
            return data;
        },

        getUserTexts: async (userId, token, forceRefresh = false) => {
            const cacheKey = `user_uploads_texts`;
            if (!forceRefresh && getValue && getValue(cacheKey)) {
                return getValue(cacheKey);
            }
            const res = await api.get(`/api/users/${userId}/uploads/texts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.texts || [];
            if (setValue) setValue(cacheKey, data);
            return data;
        },

        getUserStorage: async (userId, token, forceRefresh = false) => {
            const cacheKey = `user_storage_stats`;
            if (!forceRefresh && getValue && getValue(cacheKey)) {
                return getValue(cacheKey);
            }
            const res = await api.get(`/api/users/${userId}/storage`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (setValue) setValue(cacheKey, res.data);
            return res.data;
        },

        deleteUpload: async (id, token) => {
            const res = await api.delete(`/api/uploads/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Invalidate cache
            if (setValue) {
                setValue("user_uploads_all", null);
                setValue("user_uploads_files", null);
                setValue("user_uploads_texts", null);
                setValue("user_storage_stats", null);
            }
            return res.data;
        },

        viewUpload: async (id, type = "auto") => {
            const res = await api.get(`/api/view/${id}/?type=${type}`);
            return res.data;
        }
    };
};

export default apiService;
