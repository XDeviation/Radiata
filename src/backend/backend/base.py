from typing import Generic, TypeVar
from pydantic.generics import GenericModel

T = TypeVar("T")

class Response(GenericModel, Generic[T]):
    code: int
    data: T

    def __init__(self, data: T, code: int = 0) -> None:
        super().__init__(data = data, code = code)