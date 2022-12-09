import numpy as np
import pandas as pd
import scipy
from .machinescientist.Prior.fit_prior import read_prior_par
from .machinescientist.parallel import *
import sys

BMS_dir = 'covid19_rest_api/prevalence_app/machinescientist'

sys.path.append(BMS_dir)
sys.path.append(BMS_dir + '/Prior/')



def prior_search(N_var,N_par,BMS_dir):
    import glob
    L = glob.glob(BMS_dir + '/Prior/final_prior_param_sq.*.nv{}.np{}.*.dat'.format(N_var,N_par), recursive=True)
    L = sorted(L,reverse=True)
#     if len(L)>1:
#         print("---",N_par,N_var,L)
    try:
        return L[0]
    except IndexError:
        return "NONE"

class ensamble_model:
    """
        Ensamble model class. It contains all the tree objects of model ensamble.


    """
    def __init__(self,traces_df,closest_median_arg=416,country="Catalonia"):
        """
        Initialization of ensamble_model class. As default, the values are from Catalonia

        Parameters
        ----------
        traces_df: DataFrame
            DataFrame with the models from the ensamble, and the countries parameters
        closest_median_arg: int
            Number of the model with the closest median. As default is 416 that is from Catalonia
        country: str
            Name of the country that the ensamble belongs. As default is Catalonia.
        """
        self.trees = []
        self.closest_median_arg = closest_median_arg

        #Generating trees from the best models

        prior_file = prior_search(2,5,BMS_dir)
        prior_par = read_prior_par(
                        prior_file
                        )
        for row in range(len(traces_df)):
            model_atts = traces_df.iloc[row]
            expr = model_atts["expr"]
            params = eval(model_atts["parvals"])[country]


            tree_model = Tree(
                        variables=["T","P"],
                        x=None, y=None,
                        parameters=["_a{}_".format(i) for i in range(5)],
                        prior_par=prior_par,
                        from_string=expr
                    )
            tree_model.set_par_values(params)
            tree_model.fit_par = {}
            tree_model.get_bic(reset=True, fit=False)
            self.trees.append(tree_model)



    def get_exponent_val(self,T,P,tree):
        return tree.predict(pd.DataFrame({"T":[T],"P":[P]}))[0]

    def get_exponents(self,T,P):
        return np.array([self.get_exponent_val(T,P,tree) for tree in trees])

    def get_bias(self,T,P):
        return np.array([T**(self.get_exponent_val(T,P,tree)) for tree in trees])

    def get_prevalences(self,T,P):
        return np.array([T**(self.get_exponent_val(T,P,tree))*P*T for tree in trees])

    def get_dic_predicts_closest(self,T,P):
        dict_info = {}

        dict_info["exponent_closest"] = self.get_exponent_val(T,P,self.trees[self.closest_median_arg])

        dict_info["bias_closest"] = T**dict_info["exponent_closest"]

        dict_info["prevalences_closest"] = T**dict_info["exponent_closest"]*T*P

        return dict_info


    def get_dic_predicts(self,T,P):
        dict_info = {}

        dict_info["exponents"] = self.get_exponents(T,P)
        dict_info["exponents"] = dict_info["exponents"][np.isfinite(dict_info["exponents"])] #remove NANs and infs
        dict_info["exponents_median"] = np.nanmedian(dict_info["exponents"])
        dict_info["exponent_closest"] = self.get_exponent_val(T,P,self.trees[self.closest_median_arg])



        dict_info["bias"] = np.array([T**v for v in dict_info["exponents"]])
        dict_info["bias"] = dict_info["bias"][np.isfinite(dict_info["bias"])] #remove NANs and infs

        dict_info["bias_median"] = np.nanmedian(dict_info["bias"])
        dict_info["bias_closest"] = T**dict_info["exponent_closest"]


        dict_info["prevalences"] = np.array([T**v*T*P for v in dict_info["bias"]])
        dict_info["prevalences"] = dict_info["prevalences"][np.isfinite(dict_info["prevalences"])] #remove NANs and infs

        dict_info["prevalences_median"] = np.nanmedian(dict_info["prevalences"])
        dict_info["prevalences_closest"] = T**dict_info["exponent_closest"]*T*P

        return dict_info




if __name__ == '__main__':
    country = "Catalonia"
    file_traces = "best_traces/exponent_TP_NOTEST_global.csv"
    traces_df = pd.read_csv(file_traces, sep='\t', header=0,
                                    names=['t', 'H', 'expr', 'parvals', 'sse', 'bic', 'Hp'])

    closest_arg = 416

    #Initialising an ensamble models from Catalonia
    me = ensamble_model(traces_df)

    #Values of positive test rate (P) and test rate (T)
    P = 0.6
    T = 0.2

    #Predictions of the model with the closest median from the ensamble
    predicts = me.get_dic_predicts_closest(P,T)

    print("Test rate: {}, Positivity test rate: {}".format(T,P))
    print("Exponent:\t{}".format(predicts["exponent_closest"]))
    print("Bias:\t{}".format(predicts["bias_closest"]))
    print("Prevalence:\t{}".format(predicts["prevalences_closest"]))
