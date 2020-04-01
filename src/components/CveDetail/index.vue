/**
@desc CVE漏洞详情组件
 */
<template>
    <div>
        <el-dialog title="详细" :visible.sync="visible">
            <el-form :model="detailData" :disabled="true" v-loading="isLoadingDetail">
                <el-form-item label="CVE ID" :label-width="formLabelWidth">
                <el-input v-model="detailData.cveid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP" :label-width="formLabelWidth">
                <el-input v-model="detailData.ip" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="漏洞名称" :label-width="formLabelWidth">
                <el-input v-model="detailData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="漏洞级别" :label-width="formLabelWidth">
                <el-input v-model="detailData.level" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="漏洞类型" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.vulnerability_Type"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="CVSS 分值" :label-width="formLabelWidth">
                <el-input v-model="detailData.CVSS" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.detailData"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="解决方案" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.solution"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="CWE ID弱点类目" :label-width="formLabelWidth">
                <el-input v-model="detailData.cweid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="# of Explots" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.exploits"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="发布时间" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.publish_date"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="修订时间" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.update_date"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="访问级别" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.gained_level"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="攻击路径" :label-width="formLabelWidth">
                <el-input v-model="detailData.access" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="攻击复杂度" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.access_complexity"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="身份认证" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.authentication"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="机密性影响" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.confidentiality_impact"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="完整性影响" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.integrity_impact"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="可用性影响" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.availability_impact"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="受影响的产品及版本" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.product_name"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="产品类型" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.product_type"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="参考" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.references"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="相关模块" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.metasploit"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="漏洞条件" :label-width="formLabelWidth">
                <el-input
                    v-model="detailData.conditions"
                    autocomplete="off"
                ></el-input>
                </el-form-item>
                <el-form-item label="厂家" :label-width="formLabelWidth">
                <el-input v-model="detailData.vendors" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'cve-detail',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        detailData: {
            required: true,
            type: Object
        },
        isLoadingDetail: {
            required: true,
            type: Boolean
        },
        formLabelWidth: {
            type: String,
            default: "120px"
        }
    },
    computed: {
        visible: {
            get: function () {
                return this.dialogVisible;
            },
            set: function (newValue) {
                if (newValue === false) {
                    this.$emit('close');
                }
            }
        }
    }
}
</script>