import axios from "axios";
import { encode as base64_encode } from "base-64";

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/api`,
});

export const TalentsService = {
    async getTalents(page, size) {
        try {
            const response = await axiosInstance.get(
                `v2/talents?page=${page}&size=${size}`
            );
            return response?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    async getTalent(id, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.get(`v2/talents/${id}`, {
                headers,
            });
            return response?.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async getSponsor(id, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.get(`v3/sponsors/${id}`, {
                headers,
            });
            return response?.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async login(login, password) {
        const authString = `${login}:${password}`;
        const encodedAuthString = base64_encode(authString);
        const headers = {
            Authorization: `Basic ${encodedAuthString}`,
        };
        try {
            const response = await axiosInstance.post(
                `v2/login`,
                {},
                { headers }
            );
            return response?.data;
        } catch (error) {
            throw error;
        }
    },

    async registerTalent(newUser) {
        try {
            const response = await axiosInstance.post(`v2/talents/register`, {
                ...newUser,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    },
    async registerSponsor(newUser) {
        try {
            const response = await axiosInstance.post(`v3/sponsors/register`, {
                ...newUser,
            });
            return response?.data;
        } catch (error) {
            throw error;
        }
    },
    async getNewToken(token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.post(
                "v2/talents/login",
                {},
                { headers }
            );
            console.log(response?.data?.token);
            return response?.data?.token;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async getAllProofs(page = 0, size = 5, orderBy = "asc") {
        try {
            const response = await axiosInstance.get(
                `v2/talents/proofs?page=${page}&size=${size}&order-by=${orderBy}`
            );

            return response?.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async getProofs(id, token, size = 5) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.get(
                `v2/talents/${id}/proofs?size=${size}&order-by=desc`,
                {
                    headers,
                }
            );

            return response?.data.proofs;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async getKudos(id, token = undefined) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = {};
            if (token) {
                response = await axiosInstance.get(
                    `v3/proofs/${id}/kudos`,

                    {
                        headers,
                    }
                );
            } else {
                response = await axiosInstance.get(`v3/proofs/${id}/kudos`);
            }

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async putKudos(id, kudoses, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axiosInstance.post(
                `v5/proofs/${id}/kudos`,
                kudoses,
                {
                    headers,
                }
            );
            return response.data.amount;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async editTalent(id, editedUser, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.patch(
                `v2/talents/${id}`,
                editedUser,
                {
                    headers,
                }
            );

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async editSponsor(id, editedUser, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.patch(
                `v3/sponsors/${id}`,
                editedUser,
                {
                    headers,
                }
            );

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async editProof(id, idProof, editedProof, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.patch(
                `v2/talents/${id}/proofs/${idProof}`,
                editedProof,
                {
                    headers,
                }
            );

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async deleteTalent(id, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.delete(`v2/talents/${id}`, {
            headers,
        });
        return response;
    },
    async deleteSponsor(id, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axiosInstance.delete(`v3/sponsors/${id}`, {
            headers,
        });
        return response;
    },
    async addProof(proof, id, token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axiosInstance.post(
                `v2/talents/${id}/proofs`,
                proof,
                {
                    headers,
                }
            );
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async getSponsorKudoses(id, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.get(
                `v5/sponsors/${id}/kudos`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async deleteProof(id, idProof, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axiosInstance.delete(
                `v2/talents/${id}/proofs/${idProof}`,
                {
                    headers,
                }
            );
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async getSkills(token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.get(
                `v4/skills`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async getAllSkills(id, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.get(
                `v4/talents/${id}/proofs/skills`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async getProofsSkills(idProof, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            let response = await axiosInstance.get(
                `v5/proofs/${idProof}/skills`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async addProofsSkills(id, idProof, token, skills) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.post(
                `v5/talents/${id}/proofs/${idProof}/skills`,
                skills,
                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async deleteProofsSkills(id, idProof, token, skillId) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.delete(
                `v5/talents/${id}/proofs/${idProof}/skills/${skillId}`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async addTalentImage(id, obj, token) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };
            let response = await axiosInstance.post(
                `v3/talents/${id}/image/upload`, obj,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            throw error
        }
    },

    async addTalentSkills(id, token, skills) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.post(
                `v4/talents/${id}/skills`,
                skills,
                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async deleteTalentSkills(id, token, skillId) {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            let response = await axiosInstance.delete(
                `v4/talents/${id}/skills/${skillId}`,

                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};
