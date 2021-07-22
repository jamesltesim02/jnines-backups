import { deprecate } from "util";
import BaseApi from "./BaseApi";

/**
 * 创建api列表hooks 
 *
 * @param  {...any} apis 需要创建的api类型列表
 * 
 * @deprecated hooks方式暂时行不通
 */
@deprecate
export declare function useApi (apis: Record<string, any>): any;

/**
 * 创建数组类型的api列表  
 *
 * @param apis 数组类型的api列表
 * 
 * @deprecated hooks方式暂时行不通
 */
@deprecate
export declare function useApi (apis: any[]): any[];

/**
 * 指定需要注入api的组件  
 *
 * @param SubComponent 被注入的组件
 */
declare function apiWrapper <E extends React.Component> (SubComponent: E): any;

/**
 * 高阶组件: 将指定api注入到组件中
 *
 * @param apis 需要注入的api
 */
export declare function withApi (apis: Record<string, any>): apiWrapper;
