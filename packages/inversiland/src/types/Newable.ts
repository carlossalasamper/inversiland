/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description This type represents a newable object (a class).
 */
type Newable<T = any> = { new (...args: any[]): T };

export default Newable;
